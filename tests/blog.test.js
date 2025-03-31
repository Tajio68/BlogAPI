const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
afterAll(async () => {
  await mongoose.connection.close();
});

describe("Blog API", () => {
  it("POST /articles should create an article", async () => {
    const res = await request(app).post("/articles").send({
      title: "Test Post Jest",
      content: "This is a test post for Jest",
      author: "JEST",
    });
    expect(res.statusCode).toEqual(201);
    const del = await request(app).delete(`/articles/${res.body._id}`);
  });
});
