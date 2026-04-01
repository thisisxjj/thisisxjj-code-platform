import { randomUUID } from 'node:crypto';
import { escapeText, escapeJsonb, validateEnum } from '../utils/sql-helpers';

/**
 * 纯函数：将 Course JSON 数组转换为 SQL 插入语句
 * @param courses 解析后的业务域数组
 * @returns 拼接好的 SQL 字符串
 */
export function generateCoursesSql(courses: any[]): string {
  console.log(`⏳ 开始解析 ${courses.length} 条 Courses 业务数据...`);

  let sql = `-- === 插入 Courses 业务域数据 ===\n`;

  courses.forEach((course: any, courseIndex: number) => {
    const courseId = randomUUID();

    const difficulty = validateEnum(
      course.difficulty,
      ['beginner', 'intermediate', 'advanced'],
      'beginner',
      `Course: ${course.id}`
    );
    const status = validateEnum(
      course.status,
      ['draft', 'published', 'archived'],
      'draft',
      `Course: ${course.id}`
    );

    // 💡 修复：加回了每个课程的注释，极大提升生成的 seed.sql 可读性
    sql += `-- ------------------------------------------------------\n`;
    sql += `-- 插入课程: ${course.name} (${course.id})\n`;
    sql += `-- ------------------------------------------------------\n`;
    sql += `INSERT INTO public.courses (id, slug, name, description, long_description, difficulty, duration_in_hours, status, order_index, review_count, average_rating, xp_reward, thumbnail_url) VALUES (\n`;
    sql += `  '${courseId}',\n`;
    sql += `  ${escapeText(course.id)},\n`;
    sql += `  ${escapeText(course.name)},\n`;
    sql += `  ${escapeText(course.description)},\n`;
    sql += `  ${escapeText(course.longDescription)},\n`;
    sql += `  '${difficulty}',\n`;
    sql += `  ${course.durationInHours ?? 0},\n`;
    sql += `  '${status}',\n`;
    sql += `  ${courseIndex},\n`;
    sql += `  ${course.reviewCount ?? 0},\n`;
    sql += `  ${course.averageRating ?? 0.00},\n`;
    sql += `  ${course.xpReward ?? 100},\n`;
    sql += `  ${escapeText(course.thumbnailUrl) ?? 'NULL'}\n`;
    sql += `);\n\n`;

    if (course.modules && Array.isArray(course.modules)) {
      course.modules.forEach((module: any, moduleIndex: number) => {
        const moduleId = randomUUID();

        sql += `INSERT INTO public.modules (id, slug, course_id, name, description, order_index) VALUES (\n`;
        sql += `  '${moduleId}',\n`;
        sql += `  ${escapeText(module.id)},\n`;
        sql += `  '${courseId}',\n`;
        sql += `  ${escapeText(module.name)},\n`;
        sql += `  ${escapeText(module.description)},\n`;
        sql += `  ${moduleIndex}\n`;
        sql += `);\n\n`;

        if (module.lessons && Array.isArray(module.lessons)) {
          module.lessons.forEach((lesson: any, lessonIndex: number) => {
            const lessonId = randomUUID();

            const lessonType = validateEnum(
              lesson.type,
              ['standard', 'whiteboard', 'video', 'quiz'],
              'standard',
              `Lesson: ${lesson.id}`
            );

            sql += `INSERT INTO public.lessons (id, slug, module_id, course_id, name, description, type, context, video_id, is_free, order_index, xp_reward, objectives, tasks, code_editor, resources, whiteboard) VALUES (\n`;
            sql += `  '${lessonId}',\n`;
            sql += `  ${escapeText(lesson.id)},\n`;
            sql += `  '${moduleId}',\n`;
            sql += `  '${courseId}',\n`;
            sql += `  ${escapeText(lesson.name)},\n`;
            sql += `  ${escapeText(lesson.description)},\n`;
            sql += `  '${lessonType}',\n`;
            sql += `  ${escapeText(lesson.context)},\n`;
            sql += `  ${escapeText(lesson.videoId)},\n`;
            sql += `  ${(lesson.isFree ?? false) ? 'true' : 'false'},\n`;
            sql += `  ${lessonIndex},\n`;
            sql += `  ${lesson.xpReward ?? 10},\n`;
            sql += `  ${escapeJsonb(lesson.objectives || [])},\n`;
            sql += `  ${escapeJsonb(lesson.tasks || [])},\n`;
            sql += `  ${escapeJsonb(lesson.codeEditor || {})},\n`;
            sql += `  ${escapeJsonb(lesson.resources || [])},\n`;
            sql += `  ${escapeJsonb(lesson.whiteboard || { elements: [] })}\n`;
            sql += `);\n\n`;
          });
        }
      });
    }
  });

  return sql;
}
