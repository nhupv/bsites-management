import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";
import {Transform} from "class-transformer";

export type FbPageDocument = FbPage & Document;

@Schema({
    timestamps: true,
    versionKey: false,
    collection: 'fb-pages',
    toJSON: {
        virtuals: true,
    },
})
export class FbPage extends Document {

    @Transform(({ value }) => value.toString())
    _id: string;

    @Prop({ type: String, required: true })
    via_name: string;

    @Prop({ type: String, required: true })
    page_name: string;

    @Prop({ type: String, required: true })
    access_token: string;

    @Prop({ type: String, required: true })
    page_id: string;

    @Prop({ type: Date, required: true })
    expired_date: Date;

    @Prop({ type: String, required: false })
    url: string;

    constructor(partial: Partial<FbPage>) {
        super();
        Object.assign(this, partial);
    }
}

export const FbPageSchema = SchemaFactory.createForClass(FbPage);
