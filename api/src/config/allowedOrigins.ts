const defaultProductionOrigin = 'https://awesomegames.onrender.com';

const allowedOrigins: string[] = [
    process.env.NODE_ENV === 'production' ? (process.env.CLIENT_ORIGIN || defaultProductionOrigin) : 'http://localhost:3000'
];

export default allowedOrigins;
