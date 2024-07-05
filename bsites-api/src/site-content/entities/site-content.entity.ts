import { Document, Types, Schema as SchemaMongoose} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Transform} from "class-transformer";
import {Site} from "../../sites/entities/site.entity";
import {User} from "../../users/entities/user.entity";

export type SiteContentDocument = SiteContent & Document;

@Schema({
    timestamps: true,
    versionKey: false,
    collection: 'site-posts',
})
export class SiteContent extends Document {
    @Transform(({ value }) => value.toString())
    _id: string;

    @Prop({ type: String, required: false })
    title: string;

    @Prop({ type: String, required: true })
    question: string;

    @Prop({ type: Array, required: false })
    status: string[];

    @Prop({ type: Array, required: false })
    fb_status: string[];

    @Prop({ type: Boolean, default: true})
    priority: boolean;

    @Prop({ type: String, required: false })
    category: string;

    @Prop({ type: String, required: false })
    link: string;

    @Prop({ type: Number, required: false })
    post_id: number;

    @Prop({ type: Number, required: false })
    category_id: number;

    @Prop({ type: String, default: '', required: false })
    content?: string;

    @Prop({ type: SchemaMongoose.Types.ObjectId, ref: 'Site', required: true })
    site: String | Types.ObjectId | Site;

    @Transform(({ value }) => value.toString())
    @Prop({ type: SchemaMongoose.Types.ObjectId, ref: User.name, required: false })
    user: String | Types.ObjectId | User;

    constructor(partial: Partial<SiteContent>) {
        super();
        Object.assign(this, partial);
    }
}
export const SiteContentSchema = SchemaFactory.createForClass(SiteContent);
