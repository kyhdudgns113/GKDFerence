import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {UserDBService} from './userDB.service'
import {User, UserSchema} from './userDB.entity'

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
  providers: [UserDBService],
  exports: [UserDBService]
})
export class UserDBModule {}
