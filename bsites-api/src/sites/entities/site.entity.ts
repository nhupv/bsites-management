import {Document, Types, SchemaTypes, Schema as SchemaMongoose} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Transform} from "class-transformer";
import { User } from "../../users/entities/user.entity";
import {UrlSite} from "../../url-site/entities/url-site.entity";
import {SiteProxy} from "../../site-proxy/entities/site-proxy.entity";
import {SiteKeyword} from "../../site-keyword/entities/site-keyword.entity";

export type SiteDocument = Site & Document;

@Schema({
    timestamps: true,
    versionKey: false,
    collection: 'website',
    toJSON: {
        virtuals: true,
    },
})
export class Site extends Document {
    @Transform(({ value }) => value.toString())
    _id: string;

    @Prop({ type: String, required: true })
    name: number;

    @Prop({ type: String, required: true })
    siteUrl: string;

    @Prop({ type: Number, required: false, default: 4 })
    ctr: number;

    @Prop({ type: String, required: true })
    ip: string;

    @Prop({ type: String, required: false })
    username: string;

    @Prop({ type: String, required: false })
    password: string;

    @Prop({ type: Boolean, required: true, default: true })
    status: boolean;

    @Prop({ default: '' })
    description?: string;

    @Prop({ type: SchemaTypes.ObjectId, ref: User.name})
    user: String | Types.ObjectId | User


    // @Prop({type: [{ type: SchemaMongoose.Types.ObjectId, ref: UrlSite.name}]})
    // urls: String[] | Types.ObjectId[] | UrlSite[];
    //
    // @Prop({type: [{ type: SchemaMongoose.Types.ObjectId, ref: SiteProxy.name}]})
    // proxies: String[] | Types.ObjectId[] | SiteProxy[];
    //
    // @Prop({type: [{ type: SchemaMongoose.Types.ObjectId, ref: SiteKeyword.name }]})
    // keywords: String[] | Types.ObjectId[] | SiteKeyword[];
    constructor(partial: Partial<Site>) {
        super();
        Object.assign(this, partial);
    }
}
 const SiteSchema = SchemaFactory.createForClass(Site);
    SiteSchema.virtual('urls', {
        ref: 'UrlSite',
        localField: '_id',
        foreignField: 'site'
    });

    SiteSchema.virtual('keywords', {
        ref: 'SiteKeyword',
        localField: '_id',
        foreignField: 'site'
    });
    SiteSchema.virtual('proxies', {
        ref: 'SiteProxy',
        localField: '_id',
        foreignField: 'site'
    });
export { SiteSchema }
