import {Module} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'
import {gkdJwtSecret, gkdJwtSignOption} from 'src/common'
import {UseDBModule} from 'src/modules/useDB/useDB.module'
import {ChatListService} from './chatList.service'
import {ChatListController} from './chatList.controller'

@Module({
  imports: [
    UseDBModule,
    JwtModule.register({
      secret: gkdJwtSecret,
      signOptions: gkdJwtSignOption
    })
  ],
  controllers: [ChatListController],
  providers: [ChatListService],
  exports: [ChatListService]
})
export class ChatListModule {}
