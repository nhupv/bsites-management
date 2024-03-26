import {OmitType, PartialType} from '@nestjs/mapped-types';
import { CreateUrlSiteDto } from './create-url-site.dto';

export class UpdateUrlSiteDto extends OmitType(CreateUrlSiteDto, ['site', 'user'] as const) {}
