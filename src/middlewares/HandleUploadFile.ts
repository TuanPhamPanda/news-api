import multer, { Multer } from 'multer'
import { storage } from '../configs'

const upload: Multer = multer({ storage: storage })

export { upload }
