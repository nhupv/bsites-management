import { Injectable } from '@nestjs/common';
import { ConsoleService } from 'nestjs-console';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { PaginationParams } from '../common/pagination/dto/papgination-params.dto';
import { DomainService } from '../domain/domain.service';
@Injectable()
export class MigrateCommand {
  constructor(
    private readonly consoleService: ConsoleService,
    private readonly domainService: DomainService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {
    const cli = this.consoleService.getCli();

    this.consoleService.createCommand(
      {
        command: 'migrate:drop-collection <name>',
        description: 'Drop collection by name',
      },
      this.dropBacklinkCollection.bind(this),
      cli,
    );
  }
  async dropBacklinkCollection(name: string) {
    // const spin = createSpinner();
    try {
      await this.connection.db.dropCollection(name);
      // spin.succeed(`Collection ${name} is dropped`);
    } catch (e) {
      console.log(e);
    }
  }
}
