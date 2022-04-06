import { promises as fs } from 'fs'
import path from 'path'

const cachePath = './.cache/'

export const writeCache = async <T>(fileName: string, data: T) => {
  await fs.mkdir(cachePath, { recursive: true })
  await fs.writeFile(path.join(cachePath, fileName), JSON.stringify(data))
}

export const readCache = async <T>(
  fileName: string,
): Promise<T | undefined> => {
  try {
    const contents = await fs.readFile(path.join(cachePath, fileName), 'utf8')
    return JSON.parse(contents) as T
  } catch (error) {
    console.log('Missing or invalid cache', fileName, error)
  }
  return undefined
}
