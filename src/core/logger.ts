import winston, { createLogger, format, transports } from "winston";
import { config } from "./config";
import * as ansis from "ansis";
import { ensureError } from "@/utils/ensure-error";
import { isTermination } from "@/utils/is-termination";

type ColorName = "red" | "yellow" | "green" | "magenta" | "cyan";
type LogLevel = "error" | "warning" | "info" | "debug";

const colors = {
  error: "red",
  warning: "yellow",
  info: "green",
  debug: "cyan",
};

export const logger = createLogger({
  level: config.LOG_LEVEL,
  levels: {
    error: 0,
    warning: 1,
    info: 2,
    debug: 3,
  },
  transports: [
    new transports.Console({
      format: format.combine(
        format.prettyPrint(),
        format.splat(),
        format.timestamp({
          format: "YYYY/MM/DD - HH:mm:ss",
        }),
        format.printf((info) => {
          const color = colors[info.level as LogLevel];
          const levelColor = ansis[color as ColorName];
          const context = (info.context as string) || "";
          const formatted = [
            `${info.timestamp}`,
            levelColor.bold(info.level.toUpperCase()),
            levelColor.bold(`[${context || "Main"}]`).padEnd(25),
            config.NODE_ENV == "dev" && info.stack
              ? levelColor(
                  `${info.message}${(info.stack as string[]).join("\n")}`
                )
              : levelColor(info.message),
          ];

          return formatted.filter((f) => f).join(" ");
        })
      ),
    }),
  ],
});

/**
 * Logs the given err with the given logger.
 * Ensures that `err` is not a termination error.
 */
export function logError(params: {
  err: unknown;
  logger: winston.Logger;
  prefix?: string;
}) {
  if (isTermination(params.err)) return;

  const error = ensureError(params.err);
  params.logger.error(`${params.prefix || "Error: "}${error.stack}`);
}
