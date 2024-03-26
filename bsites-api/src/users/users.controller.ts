import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Scope,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ObjectId } from 'mongoose';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/role.enum';
import { Roles } from 'src/common/decorator/roles.decorator';
import { PaginationParams } from '../common/pagination/dto/papgination-params.dto';
import { PaginationInterceptor } from '../common/pagination/interceptor/pagination.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

@UseInterceptors(TransformInterceptor)
@Roles(Role.Admin, Role.SuperUser)
@Controller({
  path: 'users',
  scope: Scope.REQUEST,
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Request() req, @Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
  @Get()
  @UseInterceptors(PaginationInterceptor)
  async findAll(
    @Request() req,
    @Query() { perPage, sortBy, sortType }: PaginationParams,
  ) {
    try {
      return await this.usersService.findAll(
        req.user.id,
        req.query.skip,
        perPage,
        sortBy,
        sortType,
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: ObjectId): Promise<User> {
    const user: User = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Patch(':id')
  async update(
    @Param('id') id: ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userUpdate = await this.usersService.findOne(id);
    if (!userUpdate) {
      throw new NotFoundException(`User with id ${id} was not found!`);
    }
    const { fido_user } = updateUserDto;

    if (fido_user) {
      const fidoExisted = await this.usersService.findByFidoName(fido_user);

      if (fidoExisted && fidoExisted.fido_user !== userUpdate.fido_user) {
        throw new BadRequestException([
          `Fido user with name ${fido_user} has existed!`,
        ]);
      }
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: ObjectId) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found.`);
    }
    if (user._id === req.user.id) {
      throw new BadRequestException(`Can not delete user is logged in.`);
    }
    return this.usersService.remove(id);
  }
}
