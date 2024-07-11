import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {mongodbUrl} from './common'
import {AuthModule} from './modules/auth/auth.module'
import {SocketModule} from './modules/socket/socket.module'
import {UseDBModule} from './modules/useDB/useDB.module'

@Module({
  imports: [
    MongooseModule.forRoot(mongodbUrl), //
    AuthModule,
    SocketModule,
    UseDBModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
