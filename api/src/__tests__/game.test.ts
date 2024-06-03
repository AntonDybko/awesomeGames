import supertest from 'supertest'
import { server } from '../app'
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Game } from '../models/Game';
import { User } from "../models/User";


describe('game', () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()

        await mongoose.connect(mongoServer.getUri())
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })

    describe('post a game', () => {
        describe('given we provide only a name', () => {
            it('should return a 201', async () => {
                const gameData = {
                    name: "kuromasu"
                };

                const { body, statusCode } = await supertest(server).post(`/games`).send(gameData);

                expect(statusCode).toBe(201);
                expect(body).toEqual({
                    _id: expect.any(String),
                    name: "kuromasu",
                    numberOfPlayers: 1
                })
            })
        })

        describe('given we provide a name and numberOfPlayers', () => {
            it('should return a 201', async () => {
                const gameData = {
                    name: "checkers",
                    numberOfPlayers: 2
                };

                const { body, statusCode } = await supertest(server).post(`/games`).send(gameData);

                expect(statusCode).toBe(201);
                expect(body).toEqual({
                    _id: expect.any(String),
                    name: "checkers",
                    numberOfPlayers: 2
                })
            })
        })

        describe('given we provide a name and difficulty', () => {
            it('should return a 201', async () => {
                const gameData = {
                    name: "sudoku",
                    difficulty: "hard"
                };

                const { body, statusCode } = await supertest(server).post(`/games`).send(gameData);

                expect(statusCode).toBe(201);
                expect(body).toEqual({
                    _id: expect.any(String),
                    name: "sudoku",
                    numberOfPlayers: 1,
                    difficulty: "hard"
                })
            })
        })

        describe('given we provide only a name, difficulty and numberOfPlayers', () => {
            it('should return a 201', async () => {
                const gameData = {
                    name: "chess",
                    numberOfPlayers: 2,
                    difficulty: "hard"
                };

                const { body, statusCode } = await supertest(server).post(`/games`).send(gameData);

                expect(statusCode).toBe(201);
                expect(body).toEqual({
                    _id: expect.any(String),
                    name: "chess",
                    numberOfPlayers: 2,
                    difficulty: "hard"
                })
            })
        })
    })

    describe('get all games', () => {
        describe('given we have no errors', () => {
            it('should return a 200 and games array', async () => {

                const { body, statusCode } = await supertest(server).get(`/games`);

                expect(statusCode).toBe(200);
                expect(body[0]).toEqual(
                    expect.objectContaining({
                        _id: expect.any(String),
                        name: expect.any(String),
                        numberOfPlayers: expect.any(Number),
                        __v: expect.any(Number),
                    })
                );
            })
        })
    })

    describe('get a specific game', () => {
        describe('given we ask for an existing game', () => {
            it('should return a 200 and a ', async () => {
                const { body, statusCode } = await supertest(server).get(`/games/chess`);

                expect(statusCode).toBe(200);
                expect(body).toEqual([
                    expect.objectContaining({
                        _id: expect.any(String),
                        name: expect.any(String),
                        numberOfPlayers: expect.any(Number),
                        __v: expect.any(Number),
                        difficulty: expect.any(String)
                    })]
                );
            })
        })

        describe('given we ask for a game that is not present', () => {
            it('should return a 200 and an empty array', async () => {

                const { body, statusCode } = await supertest(server).get(`/games/mastermind`);

                expect(statusCode).toBe(200);
                expect(body).toEqual([]);
            })
        })
    })

    describe('delete a game', () => {
        describe('given a game does not exist', () => {
            it('should return a 200 and an appropriate message', async () => {
                const { body, statusCode } = await supertest(server).delete(`/games/fakeGame`);

                expect(statusCode).toBe(200);
                expect(body.message).toEqual('Deleted');
            })
        })

        describe('given a game does exist', () => {
            it('should return a 200 and an appropriate message', async () => {
                const { body, statusCode } = await supertest(server).delete(`/games/chess`);

                expect(statusCode).toBe(200);
                expect(body.message).toEqual('Deleted');
            })
        })
    })
    
    describe('get ranking for game', () => {
        describe('given game exists', () => {
            it('should return a 200 and a ranking', async () => {
                const { body, statusCode } = await supertest(server).get(`/ranking/kuromasu`);

                expect(statusCode).toBe(200);
                expect(body).toEqual([]);
            })
        })

        describe('given game does not exist', () => {
            it('should return a 404 and an appropriate message', async () => {
                const { body, statusCode } = await supertest(server).get(`/ranking/chess`);

                expect(statusCode).toBe(404);
                expect(body.message).toEqual('No game with specified name!');
            })
        })
    })

    describe('get mastermind ranking for user', () => {
        describe('given user exists', () => {
            it('should return a 200 and a ranking', async () => {
                const userPayload = {
                    username: "JohnSmith",
                    email: "johns@gmail.com",
                    password: "Password99!"
                }

                await User.create(userPayload);
                await Game.create({name: 'mastermind'});

                const { body, statusCode } = await supertest(server).get(`/ranking/mastermind/JohnSmith`);

                expect(statusCode).toBe(200);
                expect(body).toEqual([]);
            })
        })

        describe('given user does not exist', () => {
            it('should return a 404', async () => {
                const { body, statusCode } = await supertest(server).get(`/ranking/mastermind/fakeUser`);

                expect(statusCode).toBe(404);
                expect(body.message).toEqual('No game with specified name!');
            })
        })
    })

})
