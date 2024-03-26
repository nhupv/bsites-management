import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import {SitesService} from "../../sites/sites.service";

@ValidatorConstraint({ name: 'isSiteUrlAlreadyExist', async: true })
export class CheckSiteUrlExisted implements ValidatorConstraintInterface {
  constructor(private readonly siteService: SitesService) {}
  async validate(url: string, args: ValidationArguments) {
    const siteId = args.object['context'].params.id
    const siteExisted = await this.siteService.findByUrl(url);
    if(!siteExisted) return true
    return siteId === siteExisted._id.toString();
  }

  defaultMessage(args: ValidationArguments) {
    return 'Site url has existed!';
  }
}
