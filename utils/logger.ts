// /utils/logger.ts
const log = (level: 'log' | 'warn' | 'error' | 'debug', source: string, message: string, ...data: any[]) => {
  // `process.dev` is a Nuxt-provided boolean that is true only in development
  if (process.dev) {
    const style = 'font-weight: bold;';
    console[level](`%c[${source}]%c ${message}`, style, '', ...data);
  }
};

/**
 * A centralized logger that is only active in development mode.
 * Provides styled and contextualized console output.
 */
export const logger = {
  info: (source: string, message: string, ...data: any[]) => log('log', source, message, ...data),
  warn: (source: string, message: string, ...data: any[]) => log('warn', source, message, ...data),
  error: (source: string, message: string, ...data: any[]) => log('error', source, message, ...data),
  debug: (source: string, message: string, ...data: any[]) => log('debug', source, message, ...data),
};