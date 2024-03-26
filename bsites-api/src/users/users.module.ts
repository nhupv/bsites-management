import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersCommand } from './commands/users.command';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConsoleModule } from 'nestjs-console';
import { CheckUserExisted } from 'src/common/validator/CheckUserExisted';
import { CheckFidoUserExisted } from 'src/common/validator/CheckFidoUserExisted';
import { TelegramBotModule } from 'src/telegram/telegram.module';

@Module({
  imports: [
    ConsoleModule,
    TelegramBotModule,
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre<UserDocument>('save', async function (next) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const user = this;
            if (!user.isModified('password')) return next();

            if (user.password) {
              const salt = await bcrypt.genSalt();
              user.password = await bcrypt.hash(user.password, salt);
              next();
            }
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersCommand,
    CheckUserExisted,
    CheckFidoUserExisted,
  ],
  exports: [UsersService],
})
export class UsersModule {}
