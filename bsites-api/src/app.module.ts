import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ConsoleModule } from 'nestjs-console';
import { TelegramBotModule } from './telegram/telegram.module';
import { BullModule } from '@nestjs/bull';
import { DashboardModule } from './dashboard/dashboard.module';
import { ScheduleModule } from '@nestjs/schedule';
import * as moment from 'moment';
import { CsvModule } from 'nest-csv-parser';
import { MulterModule } from '@nestjs/platform-express';
import { HttpModule } from '@nestjs/axios';
import { MigrateModule } from './migrate/migrate.module';
import { MailModule } from './mail/mail.module';
import { SitesModule } from './sites/sites.module';
import { UrlSiteModule } from './url-site/url-site.module';
import {RouterModule} from "@nestjs/core";
// import {SiteProxyModule} from "./site-proxy/site-proxy.module";
import {SiteKeywordModule} from "./site-keyword/site-keyword.module";
import {SiteKeywordController} from "./site-keyword/site-keyword.controller";
import {UrlSiteController} from "./url-site/url-site.controller";
import {SiteProxyController} from "./site-proxy/site-proxy.controller";
import { BotModule } from './bot/bot.module';
import { ProxyModule } from './proxy/proxy.module';
import {JobsModule} from "./jobs/jobs.module";
import { SiteContentModule } from './site-content/site-content.module';
import { FbPageModule } from './fb-page/fb-page.module';

@Global()
@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_HOST}:27017/${process.env.DATABASE}?retryWrites=false`,
      {
        dbName: process.env.DATABASE,
        authSource: 'admin',
        user: process.env.DATABASE_USER,
        pass: process.env.DATABASE_PASSWORD,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        autoIndex: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      },
    ),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: +configService.get('REDIS_PORT_LOCAL'),
        },
      }),
      inject: [ConfigService],
    }),
    ConsoleModule,
    TelegramBotModule,
    DashboardModule,
    JobsModule,
    // CsvModule,
    MulterModule.register({
      dest: './uploads',
    }),
    MigrateModule,
    SitesModule,
    UrlSiteModule,
    // SiteProxyModule,
    SiteKeywordModule,
    RouterModule.register([
      {
        path: 'sites/:siteId',
        children: [
          {
            path: 'urls',
            module: UrlSiteModule,
          },
          // {
          //   path: 'proxies',
          //   module: SiteProxyModule,
          // },
          {
            path: 'keywords',
            module: SiteKeywordModule,
          },
          {
            path: 'bots',
            module: BotModule,
          },
          {
            path: 'posts',
            module: SiteContentModule,
          },
          {
            path: 'dashboard',
            module: DashboardModule,
          },
        ]
      },
    ]),
    BotModule,
    ProxyModule,
    SiteContentModule,
    FbPageModule,
    // MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'Moment',
      useValue: moment,
    },
  ],
  // exports: [ElasticsearchModule, 'Moment'],
  exports: ['Moment', AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggerMiddleware).forRoutes(SiteKeywordController, SiteProxyController, UrlSiteController);
  }
}
