import {Module} from '@nestjs/common'
import {LockService} from './lock.service'

@Module({
  imports: [
    // importing module...
  ],
  providers: [LockService],
  exports: [LockService]
})
export class LockModule {}
