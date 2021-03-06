// Generated by CoffeeScript 1.12.4
(function() {
  var Plan, c, ensureIsMine;

  Plan = require('./helpers/plan');

  c = require('./common_tasks');

  ensureIsMine = function(arg, cb) {
    var booking, uid, user;
    booking = arg.booking, user = arg.user;
    uid = user.get('id');
    if (booking.get('sellerUserId') === uid || booking.get('buyerUserId') === uid) {
      return cb({});
    } else {
      return cb({
        error: {
          id: 'forbidden',
          description: 'Only owners of booking may create it'
        }
      });
    }
  };

  module.exports = Plan(c.getLoggedInUser, c.validateArgs('booking_refusal'), c.ensure('args.userId == user.id'), c.findOne('booking.id = args.bookingId'), c.findNo('booking_refusal.bookingId == args.bookingId'), ensureIsMine, c.create('booking_refusal'));

}).call(this);
