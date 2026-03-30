import * as fs from 'fs';
import * as path from 'path';

/**
 * 集中化读取并解析 JSON 文件
 * 修复：引入泛型 <T> 保证类型安全
 */
export function loadJsonData<T = any>(relativePath: string): T {
  const absolutePath = path.resolve(process.cwd(), relativePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`找不到数据文件: ${absolutePath}`);
  }

  try {
    const rawData = fs.readFileSync(absolutePath, 'utf-8');
    return JSON.parse(rawData) as T;
  } catch (error: any) {
    throw new Error(`JSON 解析失败 [${relativePath}]: ${error.message}`);
  }
}

/**
 * 统一的写入 SQL 文件方法
 */
export function writeSqlFile(relativePath: string, content: string): void {
  const absolutePath = path.resolve(process.cwd(), relativePath);

  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  try {
    fs.writeFileSync(absolutePath, content);
  } catch (error: any) {
    throw new Error(`写入 SQL 文件失败 [${relativePath}]: ${error.message}`);
  }
}
