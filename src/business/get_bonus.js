// Generated by CoffeeScript 1.12.4
(function() {
  var Plan, c;

  c = require('./common_tasks');

  Plan = require('./helpers/plan');

  module.exports = Plan(c.getLoggedInUser, c.findAll('bonus.userId == user.id'));

}).call(this);
