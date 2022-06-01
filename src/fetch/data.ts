import { promises as fs } from 'fs'
import path from 'path'
import { logger } from '../logger'

const dataPath = './data/'

export const writeData = async <T>(fileName: string, data: T) => {
  await fs.mkdir(dataPath, { recursive: true })
  await fs.writeFile(path.join(dataPath, fileName), JSON.stringify(data))
}

export const readData = async <T>(fileName: string): Promise<T | undefined> => {
  try {
    const contents = await fs.readFile(path.join(dataPath, fileName), 'utf8')
    return JSON.parse(contents) as T
  } catch (error) {
    logger.warn('Missing or invalid data', fileName)
  }
  return undefined
}
