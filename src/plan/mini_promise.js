// Generated by CoffeeScript 1.12.4
var MiniPromise;

export default MiniPromise = function() {
  var cb, counter, done;
  counter = 0;
  cb = null;
  done = true;
  return {
    include: function(maybePromise) {
      var func;
      func = maybePromise != null ? maybePromise.then : void 0;
      if (func) {
        counter += 1;
        done = false;
        return func(function() {
          counter -= 1;
          if (counter === 0) {
            done = true;
            return typeof cb === "function" ? cb() : void 0;
          }
        });
      }
    },
    then: function(newCb) {
      if (done) {
        return newCb();
      } else {
        return cb = newCb;
      }
    }
  };
};
