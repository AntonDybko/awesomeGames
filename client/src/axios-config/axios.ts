import axios from 'axios';

const URL: string = process.env.REACT_APP_API_URL as string || "http://localhost:5000";

export default axios.create({
    baseURL: URL,
});

export const axiosProtected = axios.create({
    baseURL: URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
  });
