import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class StaticAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { query } = context.switchToHttp().getRequest();
    if (process.env.API_TOKEN !== query.api_token) {
      throw new UnauthorizedException();
    } else {
      return true;
    }
  }
}
