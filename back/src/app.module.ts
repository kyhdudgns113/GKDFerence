import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {mongodbUrl} from './server_secret'
import {UserModule} from './user'
import {AuthModule} from './auth'
import {AppController} from './app.controller'
import {AppService} from './app.service'

@Module({
  imports: [
    MongooseModule.forRoot(mongodbUrl), //
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
