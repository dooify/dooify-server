// Generated by CoffeeScript 1.12.4
(function() {
  var Plan, c;

  Plan = require('./helpers/plan');

  c = require('./common_tasks');

  module.exports = Plan(c.findOne('referral.lucaUserId == lucaUserId'), c.set('referral.isActivated = true'), c.save('referral'));

}).call(this);
