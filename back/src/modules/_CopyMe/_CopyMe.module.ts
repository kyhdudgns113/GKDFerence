import {Module} from '@nestjs/common'
import {CopyMeController} from './_CopyMe.controller'
import {CopyMeService} from './_CopyMe.service'

@Module({
  imports: [
    // importing module...
  ],
  controllers: [CopyMeController],
  providers: [CopyMeService]
})
export class CopyMeModule {}
