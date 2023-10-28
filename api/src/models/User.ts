import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
    email: string;
    password: string;
    picture_url?: string;
    birthday?: Date;
}

const userSchema = new Schema<IUser>({
    email: {
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
          validator: (value: string) => {
            // Check if the password contains at least one lowercase letter, one uppercase letter, one digit, and one special character
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
            return passwordRegex.test(value);
          },
          message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
        },
      },
    picture_url: String,
    birthday: {
        type: Date,
        validate: {
          validator: (value: Date) => {
            return !isNaN(value.getTime());
          },
          message: 'Invalid date format',
        },
      },
})

const UserModel = model<IUser>('User', userSchema);

export { UserModel };