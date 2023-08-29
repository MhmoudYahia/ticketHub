import mongoose from 'mongoose';
import { Password } from '../services/passwords';

interface userAttrs {
  email: string;
  password: string;
}

interface userModel extends mongoose.Model<userDoc> {
  build(attrs: userAttrs): userDoc;
}

interface userDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (attrs: userAttrs) => {
  return new User(attrs);
};

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

const User = mongoose.model<userDoc, userModel>('User', userSchema);

export { User };
