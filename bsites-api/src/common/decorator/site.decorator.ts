import {createParamDecorator} from "@nestjs/common";
import {Site} from "../../sites/entities/site.entity";

export const SiteParam = createParamDecorator((data, req) => {
    const ctx = req.getArgByIndex(1);
    return ctx.req.site as Site;
});
