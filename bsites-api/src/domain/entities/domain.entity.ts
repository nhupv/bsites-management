import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude, Transform } from 'class-transformer';

export type DomainDocument = Domain & Document;
@Schema({
  toObject: {
    transform: function (doc, ret, options) {
      // ret.id = ret._id;
      // delete ret._id;
      // delete ret.__v;
      Object.setPrototypeOf(ret, Object.getPrototypeOf(new Domain()));
    },
  },
  timestamps: true,
  versionKey: false,
})
export class Domain {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ required: true, unique: true })
  auctionId: number;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  endTime: string;

  @Prop({ type: Boolean })
  winning: boolean;

  @Prop({ type: Number, default: null })
  highBid: number;

  @Prop({ default: null })
  maxBid: number;

  @Prop({ default: null })
  numberOfBidders: number;

  @Prop({ default: null })
  highestBidder: string;

  @Prop({ default: null })
  minimumNextBid: number;

  @Prop({ default: null })
  bidIncrement: number;

  @Prop({ default: null })
  type: string;

  @Prop({ default: null })
  provider: string;

  @Prop({ default: null })
  detailLink: string;

  @Prop({ default: 0 })
  totalBackLink: number;

  @Prop({ default: 0 })
  totalMatched: number;

  @Prop({ default: null })
  crawledAt: Date;

  // constructor(partial: Partial<Domain>) {
  //   super();
  //   Object.assign(this, partial);
  // }
}

export const DomainSchema = SchemaFactory.createForClass(Domain);
