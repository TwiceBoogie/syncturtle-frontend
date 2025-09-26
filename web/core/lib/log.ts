export type LogLevel = "info" | "warn" | "error" | "debug";

export const log = (level: LogLevel, msg: string, meta: Record<string, unknown> = {}) => {
  const entry = {
    t: new Date().toISOString(),
    level,
    msg,
    ...meta,
  };
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console[level === "debug" ? "log" : level](`${entry.t} [${entry.level}] ${entry.msg}`, meta);
  } else {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(entry));
  }
};
