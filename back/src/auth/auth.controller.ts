import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common'
import {AuthService} from './auth.service'
import {CreateUserDto} from '../user'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    console.log('/auth/signup called with ', createUserDto)
    const {ok, body, errors} = await this.authService.signup(createUserDto)
    return {ok, body, errors}
  }

  // @Get('/signup')
  // findAll() {
  //   console.log('GET /auth/signup called')
  //   return this.authService.findAll()
  // }

  // @Get('/get/:id')
  // findOne(@Param('id') id: string) {
  //   console.log('/auth/:id called')
  //   return this.authService.findOne(+id)
  // }

  // @Patch('/patch/:id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto)
  // }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id)
  }
}
