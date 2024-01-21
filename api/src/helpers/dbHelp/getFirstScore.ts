import { Score } from "../../models/Score";
import { User } from "../../models/User";
import { Game } from "../../models/Game";

export default async function getFirstScore(username: String, gamename: String) {
    console.log('|getFirstScore>params>', username, gamename);
    
    let score = 0;
    
    try {
        const user = await User.find({ username: username });
        const game = await Game.find({ name: gamename });

        console.log('|getFirstScore>User>', user);
        console.log('|getFirstScore>Game>', game);

        if (user && game) {
            const response = await Score.findOne({
                user: user[0]._id,
                game: game[0]._id
            });
            if (response) {
                score = response.score.valueOf()
            }
            else {
                await Score.create({
                    score: 1000,
                    game: game[0]._id,
                    user: user[0]._id
                })

                score = 1000
            }
        }
    } catch (error) {
        console.error(error);
    }

    return score;
};
