import {JwtModuleOptions} from '@nestjs/jwt'

const mongoAtlasUrl =
  'mongodb+srv://dudgns113:zkdlwj12@cluster0.1le07vb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const mongodbLocalUrl = 'mongodb://localhost:27017/GKDFerence'
export const mongodbUrl = mongodbLocalUrl
export const gkdSaltOrRounds = 10
export const gkdJwtSecret = 'gkdudgns114jwt'
export const gkdJwtSignOption: JwtModuleOptions['signOptions'] = {
  expiresIn: '15h'
}
