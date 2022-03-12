import { promises as fs } from 'fs'
import { Data } from '../types'
import path from 'path'

const filePath = path.join('./.cache/data-cache.json')

export const writeCache = async (data: Data) => {
  await fs.writeFile(filePath, JSON.stringify(data))
}

export const readCache = async (): Promise<Data | undefined> => {
  try {
    const contents = await fs.readFile(filePath, 'utf8')
    return JSON.parse(contents) as Data
  } catch (error) {
    console.log('Missing or invalid cache', error)
  }
  return undefined
}
