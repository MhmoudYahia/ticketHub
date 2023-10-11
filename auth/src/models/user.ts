import mongoose from 'mongoose';
import { Password } from '../services/passwords';

interface userAttrs {
  email: string;
  password: string;
  name: string;
}

interface userModel extends mongoose.Model<userDoc> {
  build(attrs: userAttrs): userDoc;
}

interface userDoc extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  photo: string;
  phone: string;
  jobTitle: string;
  passwordChangedAt: Date;
  passwordResetExpires: Date;
  passwordResetToken: string;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: 'String',
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    photo: {
      type: String,
      default: '/imgs/default.jpg',
    },
    phone: {
      type: String,
    },
    jobTitle: {
      type: String,
    },
    passwordChangedAt: Date,
    passwordResetExpires: Date,
    passwordResetToken: String,
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = (attrs: userAttrs) => {
  return new User(attrs);
};

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  next();
});

userSchema.pre('save', function (next) {
  if (this.isModified('password') && !this.isNew) {
    this.passwordChangedAt = new Date();
  }

  next();
});

const User = mongoose.model<userDoc, userModel>('User', userSchema);

export { User };
