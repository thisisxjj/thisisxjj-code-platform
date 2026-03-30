export const escapeText = (str: any): string => {
  if (str === undefined || str === null) {
    return 'NULL';
  }
  const stringValue = String(str);
  if (stringValue.trim() === '') {
    return 'NULL';
  }
  // 处理 SQL 中的单引号转义
  return `'${stringValue.replace(/'/g, "''")}'`;
};

export const escapeJsonb = (obj: any): string => {
  if (obj === undefined || obj === null) {
    return 'NULL';
  }
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
};

export const validateEnum = (
  value: string,
  validValues: string[],
  defaultValue: string,
  context: string
): string => {
  if (!value) return defaultValue;
  if (!validValues.includes(value)) {
    console.warn(`⚠️ 警告: [${context}] 无效枚举值 '${value}'，自动降级为 '${defaultValue}'`);
    return defaultValue;
  }
  return value;
};
