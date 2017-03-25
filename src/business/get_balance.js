// Generated by CoffeeScript 1.12.4
(function() {
  var Plan, c;

  Plan = require('./helpers/plan');

  c = require('./common_tasks');

  module.exports = Plan(c.getLoggedInUser, function(arg, cb) {
    var balance, user;
    user = arg.user;
    balance = 0;
    return Plan.async(Plan(c.findAll('booking.sellerUserId == user.id'), c.findAll('booking_deal.bookingId == booking.id'), function(arg1, cb) {
      var booking_deal;
      booking_deal = arg1.booking_deal;
      balance += parseInt(booking_deal.get('hours'));
      return cb({});
    }), Plan(c.findAll('booking.buyerUserId == user.id'), c.findAll('booking_deal.bookingId == booking.id'), function(arg1, cb) {
      var booking_deal;
      booking_deal = arg1.booking_deal;
      balance -= parseInt(booking_deal.get('hours'));
      return cb({});
    }), Plan(c.findAll('bonus.userId == user.id'), function(arg1, cb) {
      var bonus;
      bonus = arg1.bonus;
      balance += parseInt(bonus.get('hours'));
      return cb({});
    }), Plan(Plan.async(c.findAll('referral.vitoUserId == user.id'), c.findAll('referral.lucaUserId == user.id')), function(arg1, cb) {
      var hours, referral;
      referral = arg1.referral;
      hours = referral.hours ? parseInt(referral.hours) : 1;
      balance += hours;
      return cb({});
    }))({
      user: user
    }).then(function() {
      return cb({
        balance: balance
      });
    });
  });

}).call(this);