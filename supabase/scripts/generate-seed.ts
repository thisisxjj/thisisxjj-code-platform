// supabase/scripts/generate-seed.ts
import * as path from 'path';
import { loadJsonData, writeSqlFile } from './utils/io-helpers';
import { generateCoursesSql } from './seeders/courses-seeder';
// import { generateProjectsSql } from './seeders/projects-seeder';

// ==========================================
// 1. 定义任务注册表规范
// ==========================================
interface SeedTask {
  domain: string;
  tablesToTruncate: string[];
  dataPath: string;
  generator: (data: any) => string;
}

// ==========================================
// 2. 注册所有业务域任务
// ==========================================
const SEED_TASKS: SeedTask[] = [
  {
    domain: 'Courses',
    tablesToTruncate: ['public.courses', 'public.modules', 'public.lessons'],
    dataPath: 'supabase/data/courses.json',
    generator: generateCoursesSql
  }
];

// ==========================================
// 3. 核心引擎 (Orchestrator)
// ==========================================
function generateMasterSeed() {
  console.log('🚀 开始构建全局 Seed 文件...\n');

  let finalSql = `-- ==========================================\n`;
  finalSql += `-- 自动生成的 Master Seed 数据\n`;
  finalSql += `-- 生成时间: ${new Date().toISOString()}\n`;
  finalSql += `-- 警告: 请勿手动修改此文件，它由 scripts/generate-seed.ts 自动生成\n`;
  finalSql += `-- ==========================================\n\n`;

  finalSql += `BEGIN;\n\n`;

  try {
    // 💡 修复：使用 Set 对所有需要 Truncate 的表进行完美去重
    const allTables = SEED_TASKS.flatMap(task => task.tablesToTruncate);
    const uniqueTables = [...new Set(allTables)].join(', ');

    if (uniqueTables) {
      finalSql += `-- 清理旧数据，保证幂等性\n`;
      finalSql += `TRUNCATE TABLE ${uniqueTables} CASCADE;\n\n`;
    }

    // 自动化遍历执行所有注册的任务
    for (const task of SEED_TASKS) {
      console.log(`⏳ 正在解析 [${task.domain}] 业务域数据...`);
      // 利用泛型确保数据读取的类型灵活性
      const data = loadJsonData<any[]>(task.dataPath);
      finalSql += task.generator(data);
    }

    finalSql += `COMMIT;\n`;

    // 写入最终文件
    const outputPath = 'supabase/seed.sql';
    writeSqlFile(outputPath, finalSql);

    console.log(`\n✅ 所有业务域 Seed 数据合并完毕！`);
    console.log(`💾 文件已成功保存至: ${path.resolve(process.cwd(), outputPath)}`);
    console.log(`💡 提示: 运行 'supabase db reset' 即可将最新数据注入本地数据库\n`);

  } catch (error: any) {
    // 💡 修复：由总控引擎统一拦截底层错误，并决定退出进程
    finalSql += `ROLLBACK;\n`; // 哪怕在脚本层面，我们也保持严谨的逻辑闭环
    console.error(`\n❌ [Seed 生成失败] 发生致命错误:`);
    console.error(`   ${error.message}\n`);
    process.exit(1);
  }
}

// 启动引擎
generateMasterSeed();
