// Generated by CoffeeScript 1.12.4
(function() {
  var Plan, c, check;

  Plan = require('./helpers/plan');

  c = require('./common_tasks');

  check = {};

  check.undefined = function() {};

  check.ad = function(arg, cb) {
    var ad;
    ad = arg.ad;
    return cb({
      ad: ad
    });
  };

  check.profile = function(arg, cb) {
    var profile;
    profile = arg.profile;
    return cb({
      profile: profile
    });
  };

  check.booking = Plan(c.getLoggedInUser, function(arg, cb) {
    var booking, isBuyer, isSeller, user;
    booking = arg.booking, user = arg.user;
    if (booking.dump != null) {
      booking = booking.dump();
    }
    isSeller = booking.sellerUserId === user.get('id');
    isBuyer = booking.buyerUserId === user.get('id');
    if (isSeller || isBuyer) {
      return cb({});
    }
  });

  check.booking_deal = Plan(c.findOne('booking.id = booking_deal.bookingId'), check.booking);

  check.booking_message = Plan(c.findOne('booking.id = booking_message.bookingId'), check.booking);

  check.booking_proposal = Plan(c.findOne('booking.id = booking_proposal.bookingId'), check.booking);

  check.booking_refusal = Plan(c.findOne('booking.id = booking_refusal.bookingId'), check.booking);

  check.booking_request = Plan(c.findOne('booking.id = booking_request.bookingId'), check.booking);

  check.contact = Plan(c.getLoggedInUser, function(arg, cb) {
    var contact, user;
    contact = arg.contact, user = arg.user;
    if (contact.userId === user.get('id')) {
      return cb();
    }
  });

  check.referral = Plan(c.getLoggedInUser, function(arg, cb) {
    var isluca, isvito, referral, user;
    referral = arg.referral, user = arg.user;
    isvito = referral.vitoUserId === user.get('id');
    isluca = referral.lucaUserId === user.get('id');
    if (isvito || isluca) {
      return cb();
    }
  });

  module.exports = function(arg, cb) {
    var args, k, payload, results, session, v;
    session = arg.session, payload = arg.payload;
    results = [];
    for (k in payload) {
      v = payload[k];
      args = {
        session: session
      };
      args[k] = v;
      results.push((function(k, v) {
        return typeof check[k] === "function" ? check[k](args, function(answer) {
          var ret;
          if (!answer.error) {
            ret = {};
            ret[k] = v;
            return cb(ret);
          }
        }) : void 0;
      })(k, v));
    }
    return results;
  };

}).call(this);