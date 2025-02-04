const axios = require("axios");
const { BookingRepository } = require("../repositories");
const db = require("../models");
const { ServerConfig } = require("../config");
const { message } = require("../utils/common/error-response");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");

async function createBooking(data) {
  return new Promise((resolve, reject) => {
    const response = db.sequelize.transaction(async function bookingImpl(t) {
      const flight = await axios.get(
        `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
      );
      const flightData = flight.data.data;
      if (data.noOfSeats > flightData.totalSeats) {
        reject( new AppError(
          "no of seats is not available",
          StatusCodes.BAD_REQUEST
        ));
      }
      resolve(true);
    });
  });
}

module.exports = {
  createBooking,
};
