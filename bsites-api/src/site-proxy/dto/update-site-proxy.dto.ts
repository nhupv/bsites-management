import {OmitType, PartialType} from '@nestjs/mapped-types';
import { CreateSiteProxyDto } from './create-site-proxy.dto';

export class UpdateSiteProxyDto extends OmitType(CreateSiteProxyDto, ['site','user'] as const) {}
