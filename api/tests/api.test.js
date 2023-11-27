const axios = require("axios");
const { getMaxListeners } = require("process");
const apiUrl = "http://localhost:5000";

describe('Testy serwera', () => {
    //get
    /*it('get main route of users', async () => {
        const response = await axios.get(`${apiUrl}/users/`);
        console.log(response.data)
        expect(response.status).toBe(200);
    });*/
    //POST
    /*it('should register a new user and return tokens', async () => {
        const response = await axios.post(`${apiUrl}/users/register`, {
            username: "Anton",
            email: "antond@gmail.com",
            password: "Anton228"
        });
        console.log(response.data)
        console.log(response.headers['set-cookie'])
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Login successful');
        expect(response.data.accessToken).toBeDefined();
        expect(response.headers['set-cookie']).toBeDefined();
    });*/
    //Post
    it('should handle successful login with username', async () => {
        const user = {emailOrUsername: "Anton", password: 'Anton228' };
        const response = await axios.post(`${apiUrl}/users/login`, user);
        console.log(response.data)
        // Assertions
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Login successful');
        expect(response.data.user).toBeDefined();
    });
    it('should handle successful login with email', async () => {
        const user = {emailOrUsername: "antond@gmail.com", password: 'Anton228' };
        const response = await axios.post(`${apiUrl}/users/login`, user);
        console.log(response.data)
        // Assertions
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Login successful');
        expect(response.data.user).toBeDefined();
    });
})