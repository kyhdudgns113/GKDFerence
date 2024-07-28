import {Module} from '@nestjs/common'
import {UseDBModule} from 'src/modules/useDB/useDB.module'
import {DocumentGsService} from './documentGs.service'

@Module({
  imports: [UseDBModule],
  providers: [DocumentGsService],
  exports: [DocumentGsService]
})
export class DocumentGsModule {}
