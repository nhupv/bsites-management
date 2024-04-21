import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable, NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../roles/role.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';
import {SitesService} from "../../sites/sites.service";

@Injectable()
export class SiteIdGuard implements CanActivate {
  constructor(private readonly sitesService: SitesService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const site = await this.sitesService.findOne(request.params.siteId)
    if(!site) {
      throw new NotFoundException(`Site was not found!`);
    }
    request['site'] = site
    return true
  }
}
