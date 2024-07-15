import {Module} from '@nestjs/common'
import {SidebarController} from './sidebar.controller'
import {SidebarService} from './sidebar.service'
import {UseDBModule} from '../useDB/useDB.module'
import {JwtModule} from '@nestjs/jwt'
import {gkdJwtSecret, gkdJwtSignOption} from 'src/common'
import {ChatListModule} from './chatList/chatList.module'

@Module({
  imports: [
    ChatListModule,
    UseDBModule,
    JwtModule.register({
      secret: gkdJwtSecret,
      signOptions: gkdJwtSignOption
    })
  ],
  controllers: [SidebarController],
  providers: [SidebarService]
})
export class SidebarModule {}
