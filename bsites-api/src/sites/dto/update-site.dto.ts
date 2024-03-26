import {OmitType} from '@nestjs/mapped-types';
import { CreateSiteDto } from './create-site.dto';

export class UpdateSiteDto extends OmitType(CreateSiteDto, ['user'] as const) {}
