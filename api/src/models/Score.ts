import { Schema, model, Document } from 'mongoose';

interface IScore extends Document {
    score: Number;
    game: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
}

const scoreSchema = new Schema<IScore>({
    score: {
        required: true,
        type: Number
    },
    game: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Game'
    },
    user: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Score = model<IScore>('Score', scoreSchema);

export { Score };