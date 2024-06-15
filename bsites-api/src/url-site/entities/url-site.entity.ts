import { Document, Types, Schema as SchemaMongoose} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Transform} from "class-transformer";
import {Site} from "../../sites/entities/site.entity";
import {User} from "../../users/entities/user.entity";

export type UrlSiteDocument = UrlSite & Document;

@Schema({
    timestamps: true,
    versionKey: false,
    collection: 'site-urls',
})
export class UrlSite extends Document {
    @Transform(({ value }) => value.toString())
    _id: string;

    @Prop({ type: String, required: true })
    url: string;

    @Prop({ type: Boolean, required: true, default: true })
    priority: boolean;

    @Prop({ default: '' })
    description?: string;

    @Prop({ type: SchemaMongoose.Types.ObjectId, ref: 'Site', required: true })
    site: String | Types.ObjectId | Site;

    @Transform(({ value }) => value.toString())
    @Prop({ type: SchemaMongoose.Types.ObjectId, ref: User.name, required: true })
    user: String | Types.ObjectId | User;

    constructor(partial: Partial<UrlSite>) {
        super();
        Object.assign(this, partial);
    }
}
export const UrlSiteSchema = SchemaFactory.createForClass(UrlSite);
