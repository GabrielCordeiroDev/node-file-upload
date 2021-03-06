import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import { Request } from 'express-serve-static-core'
import { Callback } from 'mongoose'

export const uploadFolder =
  process.env.NODE_ENV === 'test' ? 'uploadTests' : 'uploads'

const storageTypes = {
  local: multer.diskStorage({
    destination: (_, file: Express.Multer.File, cb: Callback) => {
      cb(null, path.resolve(__dirname, '..', '..', 'tmp', uploadFolder))
    },
    filename: (_: Request, file: Express.Multer.File, cb: Callback) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err, false)

        file.key = `${hash.toString('hex')}-${file.originalname}`
        cb(null, file.key)
      })
    }
  })
}

export default {
  multerConfig: {
    dest: path.resolve(__dirname, '..', '..', 'tmp', uploadFolder),
    storage: storageTypes[process.env.STORAGE_TYPE],
    limits: {
      fileSize: 2 * 1024 * 1024 // 2MB
    },
    fileFilter: (_: Request, file: Express.Multer.File, cb: Callback): void => {
      const allowedMimes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/gif'
      ]

      if (allowedMimes.includes(file.mimetype)) cb(null, true)
      else cb(new Error('Invalid file type.'), false)
    }
  }
}
