"use strict";

const AxiosMockAdapter = require("axios-mock-adapter");
const axios = require("axios");
const axiosMock = new AxiosMockAdapter(axios);

const {
  shipProduct, 
  SHIPIT_SHIP_URL,
} = require("./shipItApi");


test("shipProduct", async function () {
  axiosMock.onPost(`${SHIPIT_SHIP_URL}`)
    .reply(
      200, 
      {
        "receipt": {
          "itemId": 1000,
          "name": "Test Tester",
          "addr": "100 Test St",
          "zip": "12345-6789",
          "shipId": 7633
        }
      });

  const shipId = await shipProduct({
    productId: 1000,
    name: "Test Tester",
    addr: "100 Test St",
    zip: "12345-6789",
  });

  expect(shipId).toEqual(7633);
});
