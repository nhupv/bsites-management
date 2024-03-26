import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {HttpService } from '@nestjs/axios'

@Injectable()
export class RecaptchaGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { body } = context.switchToHttp().getRequest();
    const { data } = await this.httpService
      .post(
        `https://www.google.com/recaptcha/api/siteverify?response=${body.recaptchaToken}&secret=${process.env.RECAPTCHA_SECRET}`,
      )
      .toPromise();
    if (!data.success) {
      throw new ForbiddenException(`You're a bot, right?`);
    } else {
      return true;
    }
  }
}
