import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {CorsOptions} from '@nestjs/common/interfaces/external/cors-options.interface'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const corsOptions: CorsOptions = {
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000'], // 허용할 도메인
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // 자격 증명 허용
  }

  app.enableCors(corsOptions)
  await app.listen(4000)
}
bootstrap()
