/**
 * 开发模式的log打印
 * @function debugLogger
 * @param {string} 属于console的任何log的等级
 * @param {*} msg log信息
 * @summary 如果是任何情况下都要打印的信息，就用console，如果只是调试的信息，就用debugLogger
 */
export const devMode = import.meta.env.DEV
type LogLevel = 'debug' | 'error' | 'info' | 'log' | 'warn'
export function debugLogger(level: LogLevel, ...msg: unknown[]) {
  if (devMode)
    console[level](...msg)
}

export default {}
