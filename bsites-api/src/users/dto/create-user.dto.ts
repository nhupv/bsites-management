import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  Validate,
  IsOptional,
  MinLength,
  IsDefined,
} from 'class-validator';
import { Role } from 'src/roles/role.enum';
import { CheckFidoUserExisted } from 'src/common/validator/CheckFidoUserExisted';
import { CheckRoleUser } from 'src/common/validator/CheckRoleUser';
import { CheckUserExisted } from 'src/common/validator/CheckUserExisted';
export class CreateUserDto {
  @IsEmail()
  @Validate(CheckUserExisted, {
    message: 'Email $value already exists.',
  })
  email: string;

  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsNumber()
  age;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @MinLength(3)
  @Validate(CheckFidoUserExisted)
  @IsNotEmpty()
  @IsDefined()
  fido_user: string;


  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @Validate(CheckRoleUser, {
    message: 'Roles is invalid.',
  })
  roles: Role[];
}
