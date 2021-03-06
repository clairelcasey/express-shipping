"use strict";

const shipItAPI = require("../shipItApi");
shipItAPI.shipProduct = jest.fn();

const request = require("supertest");
const app = require("../app");

describe("POST /", function () {
  test("valid", async function () {
    shipItAPI.shipProduct
      .mockReturnValue(1234);
    console.log("shipitAPI.shipProduct = ", shipItAPI.shipProduct);

    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zipcode: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: 1234 });
  });

  test("error if invalid product id", async function () {
    shipItAPI.shipProduct
      .mockReturnValue(1234);

    const resp = await request(app).post("/shipments").send({
      productId: 999,
      name: "Test Tester",
      addr: "100 Test St",
      zipcode: "12345-6789",
    });

    expect(resp.body.error.message).toEqual([
      "instance.productId must be greater than or equal to 1000"]);
    expect(resp.status).toEqual(400);
  });

  test("error if invalid zipcode", async function () {
    shipItAPI.shipProduct
      .mockReturnValue(1234);

    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zipcode: "12345-67",
    });

    expect(resp.body.error.message).toEqual([
      'instance.zipcode does not match pattern \"^[0-9]{5}-[0-9]{4}$\"']);
    expect(resp.status).toEqual(400);
  });

  test("error if extra data provided", async function () {
    shipItAPI.shipProduct
      .mockReturnValue(1234);

    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zipcode: "12345-6767",
      test: "blah",
    });

    expect(resp.body.error.message).toEqual([
      'instance is not allowed to have the additional property \"test\"']);
    expect(resp.status).toEqual(400);
  });
});
