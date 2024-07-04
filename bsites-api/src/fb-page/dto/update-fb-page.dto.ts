import {OmitType, PartialType} from '@nestjs/mapped-types';
import { CreateFbPageDto } from './create-fb-page.dto';

export class UpdateFbPageDto extends OmitType(CreateFbPageDto, [] as const) {}
