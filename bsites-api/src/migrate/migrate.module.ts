import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { MigrateCommand } from './migrate.command';
import { DomainModule } from '../domain/domain.module';
import {SitesModule} from "../sites/sites.module";

@Module({
  imports: [ConsoleModule, SitesModule],
  providers: [MigrateCommand],
})
export class MigrateModule {}
