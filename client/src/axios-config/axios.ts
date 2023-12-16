import axios from 'axios';

const URL: string = process.env.API_URL as string || "http://localhost:5000";

export default axios.create({
    baseURL: URL,
});