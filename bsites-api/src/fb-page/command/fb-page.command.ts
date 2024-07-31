import { Injectable } from '@nestjs/common';
import { ConsoleService } from 'nestjs-console';
import {FbPageService} from "../fb-page.service";
import {UsersService} from "../../users/users.service";
@Injectable()
export class FbPageCommand {
  constructor(
    private readonly consoleService: ConsoleService,
    private readonly fbService: FbPageService,
    private readonly userService: UsersService,
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

    this.consoleService.createCommand(
        {
          command: 'migrate:user-fb-page <userId>',
          description: 'Add user field to fb page',
        },
        this.addOwnerCreatedPage.bind(this),
        cli,
    );
  }

  async addOwnerCreatedPage(userId: string) {

    if(!userId) {
      console.log('User is required')
      return
    }

    try {
      const user = await this.userService.findOne(userId)
      const pages = await this.fbService.updateMany({ user: {$exists: false}}, {user: user._id})
      console.log('Add owner created page successfully!')
    } catch (e) {
      console.log(e)
    }
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
