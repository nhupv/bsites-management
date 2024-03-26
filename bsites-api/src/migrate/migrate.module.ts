import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { MigrateCommand } from './migrate.command';
import { DomainModule } from '../domain/domain.module';

@Module({
  imports: [ConsoleModule, DomainModule],
  providers: [MigrateCommand],
})
export class MigrateModule {}
