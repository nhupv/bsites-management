import {OmitType, PartialType} from '@nestjs/mapped-types';
import { CreateSiteKeywordDto } from './create-site-keyword.dto';

export class UpdateSiteKeywordDto extends OmitType(CreateSiteKeywordDto, ['site','user'] as const) {}
