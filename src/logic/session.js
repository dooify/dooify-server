// Generated by CoffeeScript 1.12.4

import DbSession from '../db/session'
var uuid = require('uuid').v4

var Session = {
  create: function(cb) {
    var session
    session = DbSession()
    return session.save(function() {
      return cb(session.get('id'))
    })
  },
  set: function(id, key, value, cb) {
    return DbSession.find(id, function(session) {
      if (session) {
        session.set(key, value)
        return session.save(function() {
          return typeof cb === "function" ? cb() : void 0
        })
      } else {
        if (value === void 0) {
          return typeof cb === "function" ? cb() : void 0
        } else {
          throw Error("No such session!")
        }
      }
    })
  },
  get: function(id, key, cb) {
    return DbSession.find(id, function(session) {
      if (session) {
        return cb(session.get(key))
      } else {
        return cb(null)
      }
    })
  },
  validate: function(id, cb) {
    return DbSession.find(id, function(session) {
      return cb(session !== null)
    })
  }
}

export default Session