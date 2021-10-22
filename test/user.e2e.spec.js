const request = require("supertest");
const fs = require("fs/promises");

require("dotenv").config();

const db = require("../config/db");
const app = require("../app");

const User = require("../model/users/users");
const jestConfig = require("../jest.config");

const newUser = {
  email: "qwerty0@qwe.com",
  password: "12345",
};

describe("Test route users", () => {
  let token;

  beforeAll(async () => {
    await db;
    await User.deleteOne({ email: newUser.email });
  });

  afterAll(async () => {
    const mongo = await db;
    await User.deleteOne({ email: newUser.email });
    await mongo.disconnect();
  });

  it("register user", async () => {
    const response = await await request(app)
      .post("/api/users/signup")
      .send(newUser)
      .set("Accept", "application/json");

    expect(response.status).toEqual(201);
    expect(response.body).toBeDefined();
  });

  it("user exist", async () => {
    const response = await await request(app)
      .post("/api/users/signup")
      .send(newUser)
      .set("Accept", "application/json");

    expect(response.status).toEqual(409);
    expect(response.body).toBeDefined();
  });

  it("login user", async () => {
    const response = await await request(app)
      .post("/api/users/login")
      .send(newUser)
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();

    token = response.body.data.token;
  });

  it("Upload avatar", async () => {
    const buffer = await fs.readFile("./test/data/cat.jpeg");

    const response = await request(app)
      .patch("/api/users/avatars")
      .set("Authorization", `Bearer ${token}`)
      .attach("avatar", buffer, "cat.jpeg");

    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();

    token = response.body.data.token;
  });
});
