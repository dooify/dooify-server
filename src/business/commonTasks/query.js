import parse from './parse'

const Query = function(what) {
    const q = parse(what);
    const Model = require('../../db/' + q.targetName).default
    q.run = function(args, cb) {
        var matcher;
        matcher = {};
        if (q.hasConstraint) {
            matcher[q.targetColumn] = q.getConstraintValue(args);
        }
        return Model.where(matcher, function(results) {
            return cb(results, matcher);
        });
    };
    return q;
};

export default Query
