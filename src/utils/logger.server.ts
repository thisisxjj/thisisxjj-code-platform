import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";

// 确保日志目录在项目根目录，避免 PM2 运行路径漂移问题
const logDir = path.join(process.cwd(), "logs");

// 1. 数据脱敏规则：去除可能的敏感字段
const maskSensitiveData = winston.format((info) => {
	if (info.code) info.code = "***MASKED***";
	if (info.token) info.token = "***MASKED***";
	if (info.email) info.email = info.email.replace(/(.{2})(.*)(?=@)/, "$1***");
	return info;
});

// 2. 自定义企业级日志格式
const logFormat = winston.format.combine(
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
	maskSensitiveData(),
	winston.format.errors({ stack: true }), // 提取完整的 Error Stack Trace
	winston.format.json(), // 生产环境必须用 JSON，方便接入阿里云 SLS 或 ELK
);

// 3. 业务日志通道 (带压缩和自动清理)
const applicationTransport = new winston.transports.DailyRotateFile({
	filename: path.join(logDir, "application-%DATE%.log"),
	datePattern: "YYYY-MM-DD",
	zippedArchive: true, // ✅ 核心：开启 Gzip 压缩，极其节省服务器硬盘
	maxSize: "20m",
	maxFiles: "14d", // 自动删除 14 天前的日志
});

// 4. 错误日志通道
const errorTransport = new winston.transports.DailyRotateFile({
	filename: path.join(logDir, "error-%DATE%.log"),
	level: "error",
	datePattern: "YYYY-MM-DD",
	zippedArchive: true,
	maxSize: "20m",
	maxFiles: "30d", // 错误日志保留 30 天
});

export const logger = winston.createLogger({
	level: process.env.NODE_ENV === "production" ? "info" : "debug",
	format: logFormat,
	transports: [applicationTransport, errorTransport],
	// ✅ 核心：接管 Node.js 的全局崩溃，确保死前留下遗言
	exceptionHandlers: [
		new winston.transports.File({
			filename: path.join(logDir, "exceptions.log"),
		}),
	],
	rejectionHandlers: [
		new winston.transports.File({
			filename: path.join(logDir, "rejections.log"),
		}),
	],
});

// 本地开发环境友好输出
if (process.env.NODE_ENV !== "production") {
	logger.add(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.printf(
					({ timestamp, level, message, reqId, ...meta }) => {
						const traceStr = reqId ? `[${reqId}] ` : "";
						return `${timestamp} ${level}: ${traceStr}${message} ${
							Object.keys(meta).length ? JSON.stringify(meta) : ""
						}`;
					},
				),
			),
		}),
	);
}
