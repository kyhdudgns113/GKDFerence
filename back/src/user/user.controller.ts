import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common'
import {UserService} from './user.service'
import {CreateUserDto, UpdateUserDto} from './dto'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get()
  findAll() {
    return this.userService.findAll()
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.userService.findOneById(id)
  }
}
