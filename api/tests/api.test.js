const axios = require("axios");
const apiUrl = "http://localhost:5000";

let accessToken = ''
let refreshToken = ''

describe('Testy serwera', () => {
    it('should handle wrong password', async () => {
        try{
            await axios.post(`${apiUrl}/users/register`, {
                username: "Anton",
                email: "antond@gmail.com",
                password: "Anton22"
            });
        } catch(err) {
            expect(err.response.status).toBe(400);
            expect(err.response.data.message).toBe('Validation failed');
        }
    });
    it('should handle wrong email format', async () => {
        try{
            await axios.post(`${apiUrl}/users/register`, {
                username: "Anton",
                email: "",
                password: "Anton@22"
            });
        } catch(err) {
            console.log(err)
            expect(err.response.status).toBe(400);
            //expect(err.response.data.message).toBe('Validation failed');
        }
    });
    it('should handle wrong username format', async () => {
        try{
            await axios.post(`${apiUrl}/users/register`, {
                username: "",
                email: "antond@gmail.com",
                password: "Anton@22"
            });
        } catch(err) {
            console.log(err)
            expect(err.response.status).toBe(400);
            //expect(err.response.data.message).toBe('Validation failed');
        }
    });
    it('should register a new user and return tokens', async () => {
        const response = await axios.post(`${apiUrl}/users/register`, {
            username: "Anton",
            email: "antond@gmail.com",
            password: "Anton@22"
        });
        // Extract the HTTPOnly cookie from the Set-Cookie header
        const httpOnlyCookie = response.headers['set-cookie'].find((cookie) => cookie.includes('HttpOnly'));
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Register successful');
        expect(response.data.accessToken).toBeDefined();
        //expect(response.headers['set-cookie']).toBeDefined();
        expect(httpOnlyCookie).toBeDefined();
    });
    //Post
    it('should handle successful login with username', async () => {
        const user = { emailOrUsername: "Anton", password: 'Anton@22' };
        const response = await axios.post(`${apiUrl}/users/login`, user);
        const httpOnlyCookie = response.headers['set-cookie'].find((cookie) => cookie.includes('HttpOnly'));
        // Assertions
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Login successful');
        expect(response.data.user).toBeDefined();
        expect(response.data.accessToken).toBeDefined();
        expect(httpOnlyCookie).toBeDefined();
    });
    it('should handle successful login with email', async () => {
        const user = { emailOrUsername: "antond@gmail.com", password: 'Anton@22' };
        const response = await axios.post(`${apiUrl}/users/login`, user);
        accessToken = response.data.accessToken //save access token for other tests
        const cookies = response.headers['set-cookie'];
        refreshToken = extractRefreshToken(cookies); //save refresh token for other tests
        const httpOnlyCookie = response.headers['set-cookie'].find((cookie) => cookie.includes('HttpOnly'));
        // Assertions
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Login successful');
        expect(response.data.user).toBeDefined();
        expect(response.data.accessToken).toBeDefined();
        expect(httpOnlyCookie).toBeDefined();
    });
    //DELETE
    it('handle logout', async () => {
        const config = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
        };
        const response = await axios.delete(`${apiUrl}/users/logout`, config);
        // Assertions
        expect(response.status).toBe(204);
    });
    //get
    it('get main route of users', async () => {
        const config = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
        };
        const response = await axios.get(`${apiUrl}/users/`, config);
        expect(response.status).toBe(200);
    });
    it('get user`s profile', async () => {
        const response = await axios.get(`${apiUrl}/users/profile/Anton`);
        expect(response.status).toBe(200);
    });
    it('post new game with only a name', async () => {
        const data = {
            name: "mastermind"
        };
        const response = await axios.post(`${apiUrl}/games`, data);
        expect(response.status).toBe(201);
    });
    it('post new game with a name and numberOfPlayers', async () => {
        const data = {
            name: "tictactoe",
            numberOfPlayers: 2
        };
        const response = await axios.post(`${apiUrl}/games`, data);
        expect(response.status).toBe(201);
    });
    it('post new game with a name and difficulty', async () => {
        const data = {
            name: "sudoku",
            difficulty: "hard"
        };
        const response = await axios.post(`${apiUrl}/games`, data);
        expect(response.status).toBe(201);
    });
    it('post new game with name, numberOfPlayers and difficulty', async () => {
        const data = {
            name: "chess",
            numberOfPlayers: 2,
            difficulty: "hard"
        };
        const response = await axios.post(`${apiUrl}/games`, data);
        expect(response.status).toBe(201);
    });
    it('get all games', async () => {
        const response = await axios.get(`${apiUrl}/games`);
        expect(response.status).toBe(200);
    });
    it('get game with name specified in the request params', async () => {
        const response = await axios.get(`${apiUrl}/games/mastermind`);
        expect(response.status).toBe(200);
    });
    it('delete game with name specified in the request params', async () => {
        const response = await axios.delete(`${apiUrl}/games/chess`);
        expect(response.status).toBe(200);
    });
    it('post new score', async () => {
        const data = {
            gamename: "mastermind",
            score: 1234,
        }
        const config = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
        };
        const response = await axios.post(`${apiUrl}/users/profile/Anton/scores`, data, config);
        expect(response.status).toBe(201);
    });
    it('get all scores', async () => {
        const response = await axios.get(`${apiUrl}/users/profile/Anton/scores`);
        expect(response.status).toBe(200);
    });
    it('get score with specified id', async () => {
        const data = {
            gamename: "mastermind",
            score: 1234,
        }
        const config = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
        };
        const score = await axios.post(`${apiUrl}/users/profile/Anton/scores`, data, config);
        
        const response = await axios.get(`${apiUrl}/users/profile/Anton/scores/${score.data._id}`);
        expect(response.status).toBe(200);
    });
    it('delete score', async () => {
        const data = {
            gamename: "mastermind",
            score: 1234,
        }
        const config = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
        };
        const score = await axios.post(`${apiUrl}/users/profile/Anton/scores`, data, config);

        const response = await axios.delete(`${apiUrl}/users/profile/Anton/scores/${score.data._id}`, config);
        expect(response.status).toBe(200);
    });
    it('get new access token with refresh token', async () => {
        const config = {
            headers: {
              Cookie: `refreshToken=${refreshToken}`,
            },
        };
        const response = await axios.get(`${apiUrl}/users/refresh-token`, config);
        expect(response.status).toBe(200);
        expect(response.data.accessToken).toBeDefined();
        expect(response.data.user).toBeDefined();
    });
    it('should edit user profile when JWT is verified', async () => {
        const editedUser = {
            username: 'UpdatedAnton',
            email: 'antond@gmail.com"',
            password: 'Anton@22'
        };
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };
    
        const response = await axios.put(`${apiUrl}/users/profile`, editedUser, config);
        expect(response.status).toBe(200);
    });
    it('should handle wrong password in edited user', async () => {
        try{
            const editedUser = {
                username: 'UpdatedAnton',
                email: 'antond@gmail.com"',
                password: 'Anton22'
            };
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            };
            await axios.put(`${apiUrl}/users/profile`, editedUser, config);
        } catch(err) {
            expect(err.response.status).toBe(400);
            expect(err.response.data.message).toBe('Validation failed');
        }
    });
})

function extractRefreshToken(cookies) {
    console.log(cookies)
    for (const cookie of cookies) {
      const match = cookie.match(/refreshToken=([^;]+)/);
      if (match) {
        return match[1];
      }
    }
    return null;
}