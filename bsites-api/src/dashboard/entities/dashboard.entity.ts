import {Document, Schema as SchemaMongoose, Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Transform} from "class-transformer";

export type DashboardDocument = Dashboard & Document;

@Schema({
    timestamps: true,
    versionKey: false,
    collection: 'dashboards',
})
export class Dashboard extends Document {
    @Transform(({ value }) => value.toString())
    _id: string;

    @Prop({type: Number, default: 0 })
    total_views: number;

    @Prop({type: Number, default: 0 })
    total_click_ads: number;

    @Prop({ type: Number, required: true, default: 0 })
    ctr: number;

    @Prop({ type: String, required: true })
    site_url: String;

    @Prop({ type: Date, required: true })
    time: Date;

    constructor(partial: Partial<Dashboard>) {
        super();
        Object.assign(this, partial);
    }
}

export const DashboardSchema = SchemaFactory.createForClass(Dashboard);
