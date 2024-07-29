import { Injectable } from '@nestjs/common';
import { ConsoleService } from 'nestjs-console';
import {FbPageService} from "../fb-page.service";
@Injectable()
export class FbPageCommand {
  constructor(
    private readonly consoleService: ConsoleService,
    private readonly fbService: FbPageService,
  ) {
    const cli = this.consoleService.getCli();

    this.consoleService.createCommand(
        {
          command: 'migrate:expired-date',
          description: 'Convert expired date to unix timestamp',
        },
        this.convertExpiredDate.bind(this),
        cli,
    );
  }

  async convertExpiredDate() {
    const pages: Array<any> = await this.fbService.find({ expired_date: { $not: { $type: 'number'}}})
    if(pages.length === 0 ) {
      console.log('No page in db')
      return
    }

    try {
      for(const page of pages) {
        if(page.expired_date instanceof Date) {
          const unixTimestamp = Math.floor(page.expired_date.getTime() / 1000)
          await this.fbService.update(page._id, {expired_date: unixTimestamp})
        }
      }
      console.log('pages converted')
    } catch (e) {
      console.log(e)
    }
  }
}
