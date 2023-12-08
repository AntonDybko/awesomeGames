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
        expect(response.data.message).toBe('Login successful');
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