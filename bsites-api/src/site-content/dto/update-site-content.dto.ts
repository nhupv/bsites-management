import {OmitType, PartialType} from '@nestjs/mapped-types';
import {RequestUpdatePostDto} from "./request-update-post.dto";

export class UpdateSiteContentDto extends OmitType(RequestUpdatePostDto, ['status', 'site', 'user'] as const) {}
