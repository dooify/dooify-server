// Generated by CoffeeScript 1.12.4
(function() {
  var Plan, c, mail, sendMail;

  Plan = require('./helpers/plan');

  c = require('./common_tasks');

  mail = require('../mail/propose');

  sendMail = Plan(c.findOne('profile.userId = booking.sellerUserId', {
    rename: 'seller'
  }), c.findOne('profile.userId = booking.buyerUserId', {
    rename: 'buyer'
  }), c.findOne('contact.userId = booking.buyerUserId'), c.findOne('ad.id = booking.adId'), function(arg, cb) {
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

  module.exports = Plan(c.getLoggedInUser, c.validateArgs('booking_proposal'), c.findOne('booking.id = args.bookingId'), c.ensure('booking.sellerUserId == user.id'), c.findNo('booking_deal.bookingId == args.bookingId'), sendMail, c.create('booking_proposal'));

}).call(this);
