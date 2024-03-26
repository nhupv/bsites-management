import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { classToPlain, Exclude, Expose, Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';
import { Role } from 'src/roles/role.enum';

export type UserDocument = User & Document;

@Schema({
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
  toObject: {
    transform: function (doc, ret, options) {
      // ret.id = ret._id;
      // delete ret._id;
      // delete ret.__v;
      Object.setPrototypeOf(ret, Object.getPrototypeOf(new User()));
    },
  },
  timestamps: true,
  versionKey: false,
})
export class User {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ default: 20 })
  age: number;

  @Prop({ type: String, required: true })
  @Exclude()
  password: string;

  @Prop({ required: true })
  roles: Role[];

  @Prop({ default: null })
  @Exclude()
  fido_user: string;

  // constructor(partial: Partial<User>) {
  //   // super();
  //   Object.assign(this, partial);
  // }
}

export const UserSchema = SchemaFactory.createForClass(User);
