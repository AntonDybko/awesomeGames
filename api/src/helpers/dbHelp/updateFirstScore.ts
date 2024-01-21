import { Score } from "../../models/Score";
import { User } from "../../models/User";
import { Game } from "../../models/Game";

export default async function updateFirstScore(username: String, gamename: String, newScore: number) {
    console.log('|updateFirstScore>params>', username, gamename, newScore);
    
    try {
        const user = await User.find({ username: username });
        const game = await Game.find({ name: gamename });

        if (user && game) {
            await Score.findOneAndUpdate({
                user: user[0]._id,
                game: game[0]._id
            }, { score: newScore });
        }
    } catch (error) {
        console.error(error);
    }
};
