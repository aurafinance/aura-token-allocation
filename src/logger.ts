import winston from 'winston'
import fs from 'fs'

const filename = `./artifacts/initial/log.txt`

// Clear out before start
await fs.promises.writeFile(filename, '')

export const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({
      filename,
      format: winston.format.uncolorize(),
    }),
  ],
})
