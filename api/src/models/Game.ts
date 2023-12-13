import { Schema, model, Document } from 'mongoose';

interface IGame extends Document {
    name: String;
    numberOfPlayers: Number;
    difficulty?: String;
}

const gameSchema = new Schema<IGame>({
    name: {
        unique: true,
        required: true,
        lowercase: true,
        type: String
    },
    numberOfPlayers: {
        type: Number,
        default: 1
    },
    difficulty: String
});

const Game = model<IGame>('Game', gameSchema);

export { Game };