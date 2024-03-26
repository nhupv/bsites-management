import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Role } from 'src/roles/role.enum';

@ValidatorConstraint({ name: 'checkValidRole', async: true })
export class CheckRoleUser implements ValidatorConstraintInterface {
  validate(roles: any, args: ValidationArguments) {
    if(!Array.isArray(roles)) return false
    const roleAccept = [Role.User, Role.Admin];
    return (
      !(new Set(roles).size !== roles.length) &&
      roles.every((role) => roleAccept.includes(role))
    );
  }

  defaultMessage(args: ValidationArguments) {
    return 'roles is invalid';
  }
}
