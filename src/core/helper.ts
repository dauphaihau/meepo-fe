import { ClassArray, clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassArray) {
  return twMerge(clsx(inputs))
}

const getTime = () => {
  const date = new Date()
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`
}

export class logger {
  static info(content, filePath = '', line?: number) {
    // if (import.meta.env.MODE === "production") return
    console.info(`[${getTime()}]-[INFO]-[${filePath}:${line ?? ''}] \n`, JSON.stringify(content, null, 2))
  }

  static debug(message, content, filePath = '', line?: number) {
    if (import.meta.env.MODE === "production") return
    console.debug(`[${getTime()}]-[DEBUG]-[${filePath}:${line ?? ''}]: ${message} \n`, JSON.stringify(content, null, 3))
  }

  static trace(content, filePath = '', line?: number) {
    if (import.meta.env.MODE === "production") return
    console.trace(`[${getTime()}]-[TRACE]-[${filePath}:${line ?? ''}]: \n`, JSON.stringify(content, null, 2))
  }

  static warn(content, filePath = '', line?: number) {
    if (import.meta.env.MODE === "production") return
    console.warn(`[${getTime()}]-[WARN]-[${filePath}:${line ?? ''}]: \n`, JSON.stringify(content, null, 2))
  }

  static error(content, filePath = '', line?: number) {
    if (import.meta.env.MODE === "production") return
    console.error(`[${getTime()}]-[ERROR]-[${filePath}:${line ?? ''}] \n`, JSON.stringify(content, null, 2))
  }

  static log(content, filePath = '', line?: number) {
    if (import.meta.env.MODE === "production") return
    console.log(`[${getTime()}]-[LOG]-[${filePath}:${line ?? ''}] \n`, content)
  }

  static table(content, filePath = '', line?: number) {
    if (import.meta.env.MODE === "production") return
    console.table(`[${getTime()}]-[TABLE]-[${filePath}:${line ?? ''}]: \n`, content);
  }
}
