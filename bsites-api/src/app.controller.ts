import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Post,
  Delete,
  Body,
  HttpStatus,
  Response,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './common/guard/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Public } from './common/decorator/public.decorator';
import { Fido2AuthGuard } from './common/guard/fido2-auth.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { RecaptchaGuard } from './common/guard/recaptcha.guard';
// import { FidoSessionDto } from './dto/fido-session.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  // @UseGuards(RecaptchaGuard)
  @Public()
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  @UseInterceptors(TransformInterceptor)
  getProfile(@Request() req) {
    return req.user;
  }

  // @Public()
  // @Get('fido2/uri')
  // async getUrlRedirect(@Query() sessionDto: FidoSessionDto) {
  //   const sessionID = sessionDto.session_id;
  //   return this.appService.requestFido2RedirectUri(sessionID);
  // }

  @Public()
  @Get('auth/fido2')
  @UseGuards(Fido2AuthGuard)
  loginByFido2(@Request() req) {
    return this.authService.login(req.user);
  }

  @Delete('auth/logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user);
  }
}
