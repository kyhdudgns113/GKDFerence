import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'

import {User, UserController, UserSchema, UserService} from '../user'

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
