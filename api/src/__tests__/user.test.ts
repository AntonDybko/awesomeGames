import supertest from 'supertest'
import { server } from '../app'
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt, { Secret } from "jsonwebtoken";
import { User } from "../models/User";
import { Game } from '../models/Game';

let refreshToken: string | null = '';
let accessToken = '';


describe('user', () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()

        await mongoose.connect(mongoServer.getUri())
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })

    describe('user registration', () => {

        describe('given the user registration password is not valid', () => {
            it('should return a status code 400', async () => {

                const userPayload = {
                    username: "JohnSmith",
                    email: "johns@gmail.com",
                    password: "Password"
                }                
                
                const { body, statusCode } = await supertest(server).post(`/users/register`).send(userPayload);

                expect(statusCode).toBe(400);
                expect(body.message).toEqual("Validation failed");
            })
        })

        describe('given the user registration email format is not valid', () => {
            it('should return a status code 400', async () => {

                const userPayload = {
                    username: "JohnSmith",
                    email: "johnsgmail.com",
                    password: "Password99!"
                }                
                
                const { body, statusCode } = await supertest(server).post(`/users/register`).send(userPayload);

                expect(statusCode).toBe(400);
                expect(body.message).toEqual("Validation failed");
            })
        })

        describe('given the user registration username is not valid', () => {
            it('should return a status code 400', async () => {

                const userPayload = {
                    username: "J",
                    email: "johns@gmail.com",
                    password: "Password99!"
                }                
                
                const { body, statusCode } = await supertest(server).post(`/users/register`).send(userPayload);

                expect(statusCode).toBe(400);
                expect(body.message).toEqual("Validation failed");
            })
        })

        describe('given the user data is valid', () => {
            it('should return the user payload with tokens and 201 status code', async () => {

                const userPayload = {
                    username: "JohnSmith",
                    email: "johns@gmail.com",
                    password: "Password99!"
                }
                
                const { body, statusCode, headers } = await supertest(server).post(`/users/register`).send(userPayload);
                const httpOnlyCookie = headers['set-cookie'];


                expect(statusCode).toBe(201);
                expect(body).toEqual({
                    message: "Register successful",
                    accessToken: expect.any(String),
                    user: {
                        _id: expect.any(String),
                        email: "johns@gmail.com",
                        username: "JohnSmith"
                    }
                })
                expect(httpOnlyCookie[0]).toContain('HttpOnly');
                expect(httpOnlyCookie[0]).toContain('refreshToken');
            })
        })

        describe('given the user with given name already exists', () => {
            it('should return a status code 400 and an appropriate message', async () => {

                const userPayload = {
                    username: "JohnSmith",
                    email: "randomemail@gmail.com",
                    password: "Password99!"
                }
                
                const { body, statusCode } = await supertest(server).post(`/users/register`).send(userPayload);

                expect(statusCode).toBe(400);
                expect(body.message).toEqual("Username already exists");
            })
        })

        describe('given the user with given email already exists', () => {
            it('should return a status code 400 and an appropriate message', async () => {

                const userPayload = {
                    username: "JohnStone",
                    email: "johns@gmail.com",
                    password: "Password99!"
                }
                
                const { body, statusCode } = await supertest(server).post(`/users/register`).send(userPayload);

                expect(statusCode).toBe(400);
                expect(body.message).toEqual("Email already taken");
            })
        })

    })
    
    describe('user login', () => {

        describe('given unregistered user data', () => {
            it('should return a 401 and an appropriate message', async () => {

                const userPayload = {
                    emailOrUsername: "MarrySue",
                    password: "Password99!"
                }

                const { body, statusCode } = await supertest(server).post(`/users/login`).send(userPayload);

                expect(statusCode).toBe(401);
                expect(body.error).toEqual("User not found");
            })
        })

        describe('given registered user with correct username and incorrect password', () => {
            it('should return a 401 and an appropriate message', async () => {

                const userPayload = {
                    emailOrUsername: "JohnSmith",
                    password: "Password98!"
                }

                const { body, statusCode } = await supertest(server).post(`/users/login`).send(userPayload);

                expect(statusCode).toBe(401);
                expect(body.message).toEqual("Invalid credentials");
            })
        })

        describe('given registered user with valid credentials logging with username', () => {
            it('should return user payload with tokens and 200 status code', async () => {

                const userPayload = {
                    emailOrUsername: "JohnSmith",
                    password: "Password99!"
                }

                const { body, statusCode, headers } = await supertest(server).post(`/users/login`).send(userPayload);
                const httpOnlyCookie = headers['set-cookie'];

                expect(statusCode).toBe(200);
                expect(body).toEqual({
                    message: "Login successful",
                    accessToken: expect.any(String),
                    user: {
                        _id: expect.any(String),
                        email: expect.any(String),
                        username: "JohnSmith"
                    }
                });
                expect(httpOnlyCookie[0]).toContain('HttpOnly');
                expect(httpOnlyCookie[0]).toContain('refreshToken');
            })
        })

        describe('given registered user with valid credentials logging with email', () => {
            it('should return user payload with tokens and 200 status code', async () => {

                const userPayload = {
                    emailOrUsername: "johns@gmail.com",
                    password: "Password99!"
                }

                const { body, statusCode, headers } = await supertest(server).post(`/users/login`).send(userPayload);
                const httpOnlyCookie = headers['set-cookie'];

                expect(statusCode).toBe(200);
                expect(body).toEqual({
                    message: "Login successful",
                    accessToken: expect.any(String),
                    user: {
                        _id: expect.any(String),
                        email: "johns@gmail.com",
                        username: expect.any(String)
                    }
                });
                expect(httpOnlyCookie[0]).toContain('HttpOnly');
                expect(httpOnlyCookie[0]).toContain('refreshToken');

                //save access token for edit user tests
                accessToken = body.accessToken;
                //save refresh token for other tests - 3rd test in refresh token section
                const cookies = headers['set-cookie'];
                refreshToken = extractRefreshToken(cookies);
            })
        })
    })

    describe('user logout', () => {

        describe('given user without tokens', () => {
            it('should return a 401 unauthorized', async () => {
                const { statusCode} = await supertest(server).delete(`/users/logout`);

                expect(statusCode).toBe(401);
            })
        })

        describe('given user with tokens', () => {
            it('should return a 204 and remove the token cookies', async () => {
                const accessToken = signJwt();

                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };
                const { statusCode, headers } = await supertest(server).delete(`/users/logout`).set(config.headers);

                expect(statusCode).toBe(204);
                expect(headers['set-cookie']).toBeUndefined();
            })
        })
    })

    describe('refresh token', () => {
        describe('given no refresh token in cookies', () => {
            it('should return status code 401', async () => {

                const { statusCode } = await supertest(server).get('/users/refresh-token');

                expect(statusCode).toBe(401);
            });
        });
    
        describe('given invalid refresh token in cookies', () => {
            it('should return status code 404', async () => {
                
                const { statusCode } = await supertest(server)
                    .get('/users/refresh-token')
                    .set('Cookie', ['refreshToken=invalidToken']);

                expect(statusCode).toBe(404);
            });
        });
    
        describe('given valid refresh token in cookies', () => {
            it('should return new access token and user data', async () => {
    
                const { body, statusCode } = await supertest(server)
                    .get('/users/refresh-token')
                    .set('Cookie', [`refreshToken=${refreshToken}`]);
    
                expect(statusCode).toBe(200);
                expect(body.accessToken).toBeTruthy();
                expect(body.user).toEqual({
                    _id: expect.any(String),
                    email: expect.any(String),
                    username: "JohnSmith"
                });
            });
        });
    });

    describe('get users route', () => {
        describe('given the user is not logged in', () => {
            it('should return s 401 unauthorized status', async () => {
                const { statusCode } = await supertest(server).get(`/users`);

                expect(statusCode).toBe(401);
            })
        })

        describe('given the user is logged in', () => {
            it('should return the user list', async () => {
                const accessToken = signJwt();

                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                const { body, statusCode } = await supertest(server).get(`/users`).set(config.headers);

                expect(statusCode).toBe(200);
                expect(Array.isArray(body)).toBe(true);
                expect(body[0]).toEqual(
                    expect.objectContaining({
                        _id: expect.any(String),
                        role: expect.any(String),
                        email: expect.any(String),
                        username: expect.any(String),
                        password: expect.any(String),
                        __v: expect.any(Number),
                        refreshToken: expect.any(String),
                    })
                );
            })
        })
    })

    describe('get user profile', () => {
        describe('given the user does not exist', () => {
            it('should return a 404', async () => {
                const { statusCode } = await supertest(server).get(`/users/profile/unregisteredUser`);

                expect(statusCode).toBe(404);
            })
        })

        describe('given the user does exist', () => {
            it('should return a 200 and user payload', async () => {
                const userPayload = {
                    username: "MarySue",
                    email: "msue@gmail.com",
                    password: "Password99!"
                }

                await User.create(userPayload);

                const { body, statusCode } = await supertest(server).get(`/users/profile/${userPayload.username}`);

                expect(statusCode).toBe(200);
                expect(body).toStrictEqual({
                    username: "MarySue",
                    email: "msue@gmail.com",
                    role: "REGULAR",
                });
            })
        })
    })

    describe('edit user', () => {
        describe('given user with no access token', () => {
            it('should return a 401', async () => {
                const editedUser = {
                    username: 'User',
                    email: 'user@gmail.com"',
                    password: 'Password99!'
                };

                const { statusCode } = await supertest(server).put(`/users/profile`).send(editedUser);
        
                expect(statusCode).toBe(401);
            })
        })

        describe('given user with access token', () => {
            it('should return a 200', async () => {
                const editedUser = {
                    username: 'JohnSmith',
                    email: 'johnsmith2@gmail.com',
                    password: 'Password99!'
                };
                
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                const { body, statusCode } = await supertest(server).put(`/users/profile`).set(config.headers).send(editedUser);
        
                expect(statusCode).toBe(200);
                expect(body).toEqual({
                    username: 'JohnSmith',
                    email: 'johnsmith2@gmail.com',
                    role: 'REGULAR',
                })

            })
        })

        describe('given user with access token but wrong password', () => {
            it('should return a 400', async () => {
                const editedUser = {
                    username: 'JohnSmith',
                    email: 'johnsmith3@gmail.com',
                    password: 'Password999'
                };
                
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                const { body, statusCode } = await supertest(server).put(`/users/profile`).set(config.headers).send(editedUser);
        
                expect(statusCode).toBe(400);
                expect(body.message).toEqual("Validation failed");

            })
        })
    })

    describe('change password', () => {
        describe('given user with no access token', () => {
            it('should return 401', async () => {
                const editedUser = {
                    username: 'User',
                    newPassword: 'Password99!'
                };

                const { statusCode } = await supertest(server).put(`/users/changePassword`).send(editedUser);
        
                expect(statusCode).toBe(401);
            })
        })

        describe('given user with access token but not matching passwords', () => {
            it('should return a 400', async () => {
                const editedUser = {
                    username: 'JohnSmith',
                    newPassword: 'Password98!',
                    matchingNewPassword: 'Password97!'
                };

                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                const { body, statusCode } = await supertest(server).put(`/users/changePassword`).set(config.headers).send(editedUser);
        
                expect(statusCode).toBe(400);
                expect(body.message).toEqual('Validation failed');
                expect(body.details).toEqual("Password didn't match");
            })
        })

        describe('given user with access token but invalid password', () => {
            it('should return a 200', async () => {
                const editedUser = {
                    username: 'JohnSmith',
                    newPassword: 'P99!',
                    matchingNewPassword: 'P99!'
                };

                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                const { body, statusCode } = await supertest(server).put(`/users/changePassword`).set(config.headers).send(editedUser);
        
                expect(statusCode).toBe(400);
                expect(body.message).toEqual('Validation failed');
                expect(body.details).toEqual("Wrong password format.");
            })
        })

        describe('given user with access token and valid passwords', () => {
            it('should return a 400', async () => {
                const editedUser = {
                    username: 'JohnSmith',
                    newPassword: 'Password1999!',
                    matchingNewPassword: 'Password1999!'
                };

                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                const { body, statusCode } = await supertest(server).put(`/users/changePassword`).set(config.headers).send(editedUser);
        
                expect(statusCode).toBe(200);
                expect(body).toEqual({
                    username: "JohnSmith",
                    role: "REGULAR",
                    email: "johnsmith2@gmail.com"
                });
            })
        })
    })

    describe('post a new score', () => {
        describe('given user has an access token', () => {
            it('should return a 200', async () => {
                //const accessToken = signJwt();
                await Game.create({name: 'mastermind'});

                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                const data = {
                    gamename: "mastermind",
                    score: 1234,
                }

                const { body, statusCode } = await supertest(server).post(`/users/profile/JohnSmith/scores`).set(config.headers).send(data);

                expect(statusCode).toBe(201);
                expect(body).toEqual({
                    score: 1234,
                    game: expect.any(String),
                    _id: expect.any(String),
                    user: expect.any(String),
                })
            })
        })

        describe('given user does not have an access token', () => {
            it('should return a 401', async () => {

                const data = {
                    gamename: "mastermind",
                    score: 1234,
                }

                const { statusCode } = await supertest(server).post(`/users/profile/JohnSmith/scores`).send(data);

                expect(statusCode).toBe(401);
            })
        })

        describe('given user does not exist', () => {
            it('should return a 401', async () => {

                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                const data = {
                    gamename: "mastermind",
                    score: 1234,
                }

                const { statusCode } = await supertest(server).post(`/users/profile/fakeUser/scores`).set(config.headers).send(data);

                expect(statusCode).toBe(400);
            })
        })
    })

    describe('get all scores for user', () => {
        describe('given user exists', () => {
            it('should return a 200 and an array with scores', async () => {
                const { body, statusCode } = await supertest(server).get(`/users/profile/JohnSmith/scores`);

                expect(statusCode).toBe(200);
                expect(body).toEqual([
                    expect.objectContaining({
                        _id: expect.any(String),
                        game: expect.any(String),
                        user: expect.any(String),
                        score: expect.any(Number),
                    })
                ]);
            })  
        })

        describe('given user does not exists', () => {
            it('should return a 400', async () => {
                const { body, statusCode } = await supertest(server).get(`/users/profile/fakeUser/scores`);

                expect(statusCode).toBe(400);
            })  
        })
    })

    describe('get score with specified id', () => {
        describe('given user and score does exist', () => {
            it('should return a 200 and score payload', async () => {
                const data = {
                    gamename: "mastermind",
                    score: 1324,
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };
                const score = await supertest(server).post(`/users/profile/JohnSmith/scores`).set(config.headers).send(data);
        
                const {body, statusCode} = await supertest(server).get(`/users/profile/JohnSmith/scores/${score.body._id}`);
                expect(statusCode).toBe(200);
                expect(body).toEqual([
                    expect.objectContaining({
                        _id: expect.any(String),
                        game: expect.any(String),
                        user: expect.any(String),
                        score: expect.any(Number),
                    })
                ]);
            })
        })

        describe('given score for user does not exist', () => {
            it('should return a 404', async () => {
        
                const { statusCode } = await supertest(server).get(`/users/profile/Anton/scores/132`);
                
                expect(statusCode).toBe(404);
            })
        })
    })

    describe('delete a score', () => {
        describe('given we have a valid id for the score and access token', () => {
            it('should return a 200 and an appropriate message', async () => {
                const data = {
                    gamename: "mastermind",
                    score: 1324,
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };
                const score = await supertest(server).post(`/users/profile/JohnSmith/scores`).set(config.headers).send(data);
        
                const { body, statusCode } = await supertest(server).delete(`/users/profile/JohnSmith/scores/${score.body._id}`).set(config.headers);
                expect(statusCode).toBe(200);
                expect(body.message).toEqual('Deleted');
            })
        })

        describe('given we have an invalid id for the score and access token', () => {
            it('should return a 404', async () => {
                const data = {
                    gamename: "mastermind",
                    score: 1324,
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };
        
                const { body, statusCode } = await supertest(server).delete(`/users/profile/JohnSmith/scores/123`).set(config.headers);
                expect(statusCode).toBe(404);
            })
        })

        describe('given no access token', () => {
            it('should return a 401', async () => {
                const data = {
                    gamename: "mastermind",
                    score: 1324,
                }

        
                const { statusCode } = await supertest(server).delete(`/users/profile/JohnSmith/scores/123`);
                expect(statusCode).toBe(401);
            })
        })
    })

    describe('get scores for user by game', () => {
        describe('given a valid user and game', () => {
            it('should return a 200 and a score payload', async () => {


                const { body, statusCode } = await supertest(server).get(`/users/profile/JohnSmith/scores/byGame/mastermind`);

                expect(statusCode).toBe(200);
                expect(body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            _id: expect.any(String),
                            game: expect.any(String),
                            user: expect.any(String),
                            score: expect.any(Number),
                        })
                    ])
                );
            })
        })

        describe('given invalid user', () => {
            it('should return a 400', async () => {
                const { statusCode } = await supertest(server).get(`/users/profile/fakeUser/scores/byGame/mastermind`);

                expect(statusCode).toBe(400);
            })
        })
    })
    
})


function extractRefreshToken(cookies: string): string | null {
    for (const cookie of cookies) {
        const match = cookie.match(/refreshToken=([^;]+)/);
        if (match) {
            return match[1];
        }
    }
    return null;
}

function signJwt() {
    const jwtSecret = process.env.ACCESS_TOKEN_SECRET || 'AccessTokenSecret';
    const accessToken = jwt.sign(
        { _id: new mongoose.Types.ObjectId().toString(), username: "" },
        jwtSecret as Secret,
        { expiresIn: "1h" },
    );
    return accessToken;
}