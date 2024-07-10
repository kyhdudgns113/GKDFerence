import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {mongodbUrl} from './server_secret'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {UserModule} from './user/user.module'
import {AuthModule} from './auth/auth.module'
import {SocketModule} from './socket/socket.module'

@Module({
  imports: [
    MongooseModule.forRoot(mongodbUrl), //
    AuthModule,
    SocketModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
