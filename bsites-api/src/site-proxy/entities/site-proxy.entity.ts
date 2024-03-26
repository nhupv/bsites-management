import {Document, Schema as SchemaMongoose, Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Transform} from "class-transformer";
import {Site} from "../../sites/entities/site.entity";
import {User} from "../../users/entities/user.entity";

export type SiteProxyDocument = SiteProxy & Document;

@Schema({
    timestamps: true,
    versionKey: false,
    collection: 'site-proxies',
})
export class SiteProxy extends Document {
    @Transform(({ value }) => value.toString())
    _id: string;

    @Prop({ default: '' })
    name?: string;

    @Prop({ default: '' })
    description?: string;

    @Prop({ type: String, required: true })
    proxy: string;

    @Prop({ type: Types.ObjectId, ref: 'Site', required: true })
    site: String | Types.ObjectId | Site;

    @Transform(({ value }) => value.toString())
    @Prop({ type: SchemaMongoose.Types.ObjectId, ref: User.name, required: true })
    user: String | Types.ObjectId | User;

    constructor(partial: Partial<SiteProxy>) {
        super();
        Object.assign(this, partial);
    }
}

export const SiteProxySchema = SchemaFactory.createForClass(SiteProxy);
