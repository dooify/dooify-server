// Generated by CoffeeScript 1.12.4
(function() {
  var Plan, c, ensureHasHours, getBalance, mail, sendMail;

  Plan = require('./helpers/plan');

  c = require('./common_tasks');

  mail = require('../mail/deal');

  getBalance = require('./get_balance');

  ensureHasHours = function(arg, cb) {
    var balance, booking_proposal;
    balance = arg.balance, booking_proposal = arg.booking_proposal;
    if (balance - parseInt(booking_proposal.get('hours')) < 0) {
      return cb({
        error: {
          id: 'forbidden',
          description: "Insufficient hours",
          message: "You don't have enough hours on your account to accept this proposal"
        }
      });
    } else {
      return cb({});
    }
  };

  sendMail = Plan(c.findOne('profile.userId = booking.sellerUserId', {
    rename: 'seller'
  }), c.findOne('profile.userId = booking.buyerUserId', {
    rename: 'buyer'
  }), c.findOne('contact.userId = booking.sellerUserId'), c.findOne('ad.id = booking.adId'), function(arg, cb) {
    var ad, booking, buyer, code, contact, seller;
    booking = arg.booking, buyer = arg.buyer, seller = arg.seller, contact = arg.contact, code = arg.code, ad = arg.ad;
    return mail({
      buyer: buyer,
      seller: seller,
      booking: booking,
      ad: ad,
      to: contact.get('mail')
    }, cb);
  });

  module.exports = Plan(c.getLoggedInUser, c.preventArgs('hours', 'time'), c.findOne('booking.id = args.bookingId'), c.ensure('booking.buyerUserId == user.id', 'Only the buyer may make a deal'), c.findNo('booking_deal.bookingId == args.bookingId'), c.findOne('booking_proposal.bookingId = args.bookingId', {
    last: true
  }), c.set('args.hours = booking_proposal.hours'), c.set('args.time = booking_proposal.time'), getBalance, ensureHasHours, sendMail, c.create('booking_deal'));

}).call(this);