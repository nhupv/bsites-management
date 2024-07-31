import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model, ObjectId } from 'mongoose';
import { PaginationResultInterface } from '../common/pagination/interface/pagination-result.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createUser = new this.userModel(createUserDto);
    return createUser.save();
  }

  async findAll(
    id: ObjectId,
    skip: number,
    limit: number,
    sortBy: string,
    sortType: string,
  ): Promise<PaginationResultInterface<User>> {
    const total = await this.userModel.countDocuments().exec();
    const data: User[] = await this.userModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: [sortType] })
      .exec();
    return { data, total };
  }

  findOne(id: ObjectId | string): Promise<User> {
    return this.userModel.findOne({ _id: id }).exec();
  }

  update(id: ObjectId, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate({ _id: id }, updateUserDto, {
      new: true,
    });
  }

  remove(id: ObjectId) {
    return this.userModel.findOneAndDelete({ _id: id });
  }
  findByUsername(username: string): Promise<User | undefined> {
    return this.userModel
      .findOne({ email: username })
      .select('+password')
      .exec();
  }
  findByFidoName(fidoUser: string): Promise<User | undefined> {
    return this.userModel.findOne({ fido_user: fidoUser }).exec();
  }
}
