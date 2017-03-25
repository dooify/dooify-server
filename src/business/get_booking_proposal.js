// Generated by CoffeeScript 1.12.4
(function() {
  var Plan, c, getMyBookings;

  c = require('./common_tasks');

  Plan = require('./helpers/plan');

  getMyBookings = require('./helpers/get_my_bookings');

  module.exports = Plan(c.getLoggedInUser, getMyBookings, c.findAll('booking_proposal.bookingId == booking.id'));

}).call(this);
