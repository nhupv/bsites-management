import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { RolesGuard } from './common/guard/roles.guard';
import { JwtAuthGuard } from './common/guard/jwt-auth.guard';
import helmet from 'helmet';
import { useContainer } from 'class-validator';
import {ExtendBodyUserIdInterceptor} from "./common/interceptors/extend-body-userId.interceptor";
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(helmet());

  // const whitelist: string[] = (process.env.ALLOW_CORS).split(',');

  // app.enableCors({
  // origin: function (origin, callback) {
  //   if (whitelist.indexOf(origin) !== -1) {
  //     console.log("allowed cors for:", origin)
  //     callback(null, true)
  //   } else {
  //     console.log("blocked cors for:", origin)
  //     callback(new Error('Not allowed by CORS'))
  //   }
  // },
  // allowedHeaders: '*',
  // methods: "GET,PUT,POST,PATCH,DELETE,UPDATE,OPTIONS",
  // credentials: true,
  // });
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // transformOptions: { enableImplicitConversion: true },
      forbidUnknownValues: true,
      // forbidNonWhitelisted: true,
      validationError: {
        target: false,
      },
    }),
  );
  app.useGlobalInterceptors(new ExtendBodyUserIdInterceptor());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));
  if (process.env.NODE_ENV === 'production') {
    app.useGlobalFilters(new HttpExceptionFilter());
  }

  await app.listen(4000);
}
bootstrap();
