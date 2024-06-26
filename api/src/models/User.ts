import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  role: string;
  email: string;
  username: string;
  refreshToken: string;
  password: string;
  picture_url?: string;
  birthday?: Date;
}

const userSchema = new Schema<IUser>({
  role: {
    type: String,
    enum: ['REGULAR', 'ADMIN', 'MODERATOR'],
    default: 'REGULAR'
  },
  email: {
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  username: {
    unique: true,
    required: true,
    type: String,
    minLength: 4,
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  picture_url: {
    type: String,
  },
  birthday: {
    type: Date,
    validate: {
      validator: (value: Date) => {
        return value < new Date();
      },
      message: 'Invalid date format',
    },
  },
  refreshToken: {
    type: String,
  }
})

const User = model<IUser>('User', userSchema);

export { User };