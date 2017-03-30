var _ensureSchema, ensureColumns, ensureTableExists, prefix, query
const uuid = require('node-uuid').v4

query = require('./')

prefix = process.env.DOO_DB || process.env.DOO_NAME

if (prefix) {
    prefix = (prefix.toLowerCase()) + "_"
} else {
    prefix = ""
}

const ModelFactory = (arg) => {
    var Model, columns, connections, createInstance, dbFields, ensureSchema, fields, implicitDbFields, implicitFields, k, methods, ref, schemaReady, serialize, tableName, v, validate, where;
    tableName = arg.tableName, columns = arg.columns, validate = arg.validate, methods = (ref = arg.methods) != null ? ref : {};

    if (tableName == null) {
        throw Error("Need tableName!");
    }
    if (columns == null) {
        throw Error("Need columns!");
    }

    tableName = "" + prefix + tableName;
    connections = columns;

    fields = (function() {
        var results1;
        results1 = [];
        for (k in connections) {
            v = connections[k];
            results1.push(k);
        }
        return results1;
    })();

    dbFields = (function() {
        var results1;
        results1 = [];
        for (k in connections) {
            v = connections[k];
            results1.push(v[0]);
        }
        return results1;
    })();

    implicitDbFields = ['id', 'created_at'];
    implicitFields = ['id', 'createdAt'];
    schemaReady = false;

    ensureSchema = function(cb) {
        if (schemaReady) {
            return typeof cb === "function" ? cb() : void 0;
        } else {
            return _ensureSchema(tableName, connections, function() {
                schemaReady = true;
                return typeof cb === "function" ? cb() : void 0;
            });
        }
    };

    Model = function(args) {
        var data, dirty, fn, hasDbRow, insert, method, moveToGraveyard, name, overrideCreatedAt, overrideId, overrideSetId, shared;
        if (args == null) {
            args = {};
        }
        data = {};
        hasDbRow = false;
        dirty = true;
        overrideCreatedAt = false;
        overrideSetId = args._overrideSetId;
        delete args._overrideSetId;
        for (k in args) {
            v = args[k];
            if (k === '_hasDbRow') {
                hasDbRow = args._hasDbRow;
                if (hasDbRow) {
                    dirty = false;
                }
            } else {
                if (fields.indexOf(k) >= 0 || implicitFields.indexOf(k) >= 0) {
                    if (typeof v === 'string') {
                        v = v.trim();
                    }
                    data[k] = v;
                } else {
                    throw Error("No such field '" + k + "'.");
                }
            }
        }
        if (!hasDbRow) {
            if (data.createdAt) {
                overrideCreatedAt = data.createdAt;
                delete data.createdAt;
            }
            overrideId = null;
            if (data.id != null) {
                if (!overrideSetId) {
                    throw Error("Forbidden to set ID manually.");
                }
                overrideId = data.id;
                delete data.id;
            }
            if (!Model.validate({
                args: data
            })) {
                throw Error('Validation failed.');
            }
            data.id = overrideId || uuid().replace(/-/g, '');
        }
        moveToGraveyard = function(cb) {
            var fieldsStatement, sql;
            fieldsStatement = implicitDbFields.concat(dbFields).join();
            sql = "BEGIN; INSERT INTO graveyard_" + tableName + " (" + fieldsStatement + ") SELECT " + fieldsStatement + " FROM " + tableName + " WHERE id = '" + data.id + "'; DELETE FROM " + tableName + " WHERE id = '" + data.id + "'; COMMIT;";
            return query(sql, function() {
                return cb();
            });
        };
        insert = function(cb) {
            var createdAtStr, f, fieldsStatement, i, sql, val_num, vals, valuesStatement;
            vals = (function() {
                var j, len, results1;
                results1 = [];
                for (j = 0, len = fields.length; j < len; j++) {
                    f = fields[j];
                    results1.push(data[f]);
                }
                return results1;
            })();
            val_num = fields.length > 0 ? "," + ((function() {
                var j, ref1, results1;
                results1 = [];
                for (i = j = 1, ref1 = fields.length; 1 <= ref1 ? j <= ref1 : j >= ref1; i = 1 <= ref1 ? ++j : --j) {
                    results1.push("$" + i);
                }
                return results1;
            })()).join() : "";
            createdAtStr = data.createdAt.toISOString().replace('T', ' ').replace('Z', '');
            fieldsStatement = implicitDbFields.concat(dbFields).join();
            valuesStatement = ("'" + data.id + "', '" + createdAtStr + "'") + val_num;
            sql = "INSERT INTO " + tableName + " (" + fieldsStatement + ") VALUES (" + valuesStatement + ")";
            return query.apply(null, [sql].concat(vals.slice(), [function() {
                hasDbRow = true;
                return cb();
            }]));
        };
        shared = {
            inspect: function(depth) {
                return "Model#" + tableName + ":(" + (JSON.stringify(shared.dump())) + ")";
            },
            get: function(what) {
                if (fields.indexOf(what) >= 0 || implicitFields.indexOf(what) >= 0) {
                    return data[what];
                } else {
                    throw Error("No such field '" + what + "'.");
                }
            },
            set: function(k, v) {
                if (k === 'id') {

                } else if (fields.indexOf(k) >= 0) {
                    if (data[k] !== v) {
                        data[k] = v;
                        return dirty = true;
                    }
                } else {
                    throw Error("No such field '" + k + "'.");
                }
            },
            save: function(cb) {
                if (hasDbRow) {
                    data.createdAt = new Date();
                } else {
                    data.createdAt = overrideCreatedAt || new Date();
                }
                return moveToGraveyard(function() {
                    return insert(cb);
                });
            },
            remove: function(cb) {
                var createdAtStr, sql;
                data.createdAt = new Date();
                createdAtStr = data.createdAt.toISOString().replace('T', ' ').replace('Z', '');
                sql = "BEGIN; INSERT INTO graveyard_" + tableName + " (id, created_at, is_deleted) VALUES ( '" + data.id + "', '" + createdAtStr + "', 't' ); DELETE FROM " + tableName + " where id = '" + data.id + "'; COMMIT;";
                return query(sql, function() {
                    data.isDeleted = true;
                    return cb();
                });
            },
            dump: function() {
                var j, len, res;
                res = {};
                for (j = 0, len = fields.length; j < len; j++) {
                    k = fields[j];
                    res[k] = data[k];
                }
                res.id = data.id;
                if (data.isDeleted) {
                    res.isDeleted = true;
                }
                res.createdAt = data.createdAt;
                return res;
            },
            equals: function(other) {
                var dump1, dump2;
                dump1 = shared.dump();
                dump2 = other.dump();
                return JSON.stringify(dump1) === JSON.stringify(dump2);
            }
        };
        fn = function(method) {
            return shared[name] = function() {
                var args;
                args = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
                return method.apply(null, [shared].concat([].slice.call(args)));
            };
        };
        for (name in methods) {
            method = methods[name];
            fn(method);
        }
        return shared;
    };
    Model.ensureSchema = ensureSchema;
    Model.validate = function(arg1) {
        var args, results1;
        args = arg1.args;
        if (args.id != null) {
            throw Error("Cannot set ID");
        }
        results1 = [];
        for (k in args) {
            v = args[k];
            if (fields.indexOf(k) < 0) {
                throw Error("No such column `" + k + "`");
            } else {
                results1.push(void 0);
            }
        }
        return results1;
    };
    Model.find = function(id, cb) {
        return Model.where({
            id: id
        }, function(rows) {
            if (rows.length === 0) {
                return cb(null);
            } else {
                return cb(rows[0]);
            }
        });
    };
    Model.where = function() {
        var conditions, other;
        conditions = arguments[0], other = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];
        return where.apply(null, [conditions].concat([].slice.call(other)));
    };
    Model.getTableName = function() {
        return tableName;
    };
    Model.serializeConditions = function(conditions) {
        return serialize(conditions);
    };
    Model.keyToDbKey = function(key) {
        if (key === 'id') {
            return 'id';
        } else {
            if (connections[key] != null) {
                return connections[key][0];
            } else {
                throw "No such connection `" + key + "` for " + tableName;
            }
        }
    };
    serialize = function(conditions, operator, counter) {
        var a, args, condTexts, extraConds, field, j, l, len, len1, matchers, newArgs, newWhere, otherKey, otherModel, otherTableName, ourKey, ref1, ref2;
        if (operator == null) {
            operator = 'AND';
        }
        if (counter == null) {
            counter = 1;
        }
        condTexts = [];
        args = [];
        for (k in conditions) {
            v = conditions[k];
            if (k === 'exec') {
                condTexts.push(v.exec);
                continue;
            }
            if (k === 'or') {
                ref1 = serialize(v, 'OR', counter), newWhere = ref1[0], newArgs = ref1[1];
                condTexts.push("(" + newWhere + ")");
                for (j = 0, len = newArgs.length; j < len; j++) {
                    a = newArgs[j];
                    args.push(a);
                }
                continue;
            }
            if (k === 'hasA') {
                otherModel = v[0], matchers = v[1], conditions = v[2];
                ref2 = otherModel.serializeConditions(conditions, 'AND', counter), newWhere = ref2[0], newArgs = ref2[1];
                otherTableName = otherModel.getTableName();
                extraConds = [];
                for (otherKey in matchers) {
                    ourKey = matchers[otherKey];
                    otherKey = otherModel.keyToDbKey(otherKey);
                    ourKey = Model.keyToDbKey(ourKey);
                    extraConds.push(otherKey + " = " + ourKey);
                }
                condTexts.push("EXISTS (SELECT 1 FROM " + (otherModel.getTableName()) + " WHERE " + newWhere + " AND " + (extraConds.join(' AND ')) + ")");
                for (l = 0, len1 = newArgs.length; l < len1; l++) {
                    a = newArgs[l];
                    args.push(a);
                }
                continue;
            }
            field = Model.keyToDbKey(k);
            args.push(v);
            condTexts.push(field + " = $" + counter);
            counter += 1;
        }
        return [condTexts.join(" " + operator + " "), args];
    };
    where = function() {
        var args, cb, conditions, dbEx, ex, exclude, fieldsToFetch, index, j, len, limit, other, ref1, sql, whereStr, xargs;
        conditions = arguments[0], other = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];
        cb = other.pop();
        xargs = other[0] || {};
        ref1 = serialize(conditions), whereStr = ref1[0], args = ref1[1];
        fieldsToFetch = ['*'];
        if (xargs.exclude) {
            fieldsToFetch = implicitDbFields.concat(dbFields);
            exclude = xargs.exclude || [];
            if (exclude.pop == null) {
                exclude = [exclude];
            }
            for (j = 0, len = exclude.length; j < len; j++) {
                ex = exclude[j];
                dbEx = connections[ex][0];
                index = fieldsToFetch.indexOf(dbEx);
                if (index > -1) {
                    fieldsToFetch.splice(index, 1);
                }
            }
        }
        limit = '';
        if (xargs.limit) {
            limit = " LIMIT " + xargs.limit;
        }
        sql = "SELECT " + (fieldsToFetch.join()) + " FROM " + tableName + " " + (whereStr ? 'WHERE' : '') + " " + whereStr + " " + limit;
        return query.apply(null, [sql].concat([].slice.call(args), [function(rows) {
            var instance, l, len1, results, row;
            results = [];
            for (l = 0, len1 = rows.length; l < len1; l++) {
                row = rows[l];
                instance = createInstance(row);
                results.push(instance);
            }
            return cb(results);
        }]));
    };
    Model.execute = function() {
        var args, sql;
        sql = arguments[0], args = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];
        return query.apply(null, [sql].concat([].slice.call(args), [function(rows) {
            var instance, j, len, results, row;
            results = [];
            for (j = 0, len = rows.length; j < len; j++) {
                row = rows[j];
                instance = createInstance(row);
                results.push(instance);
            }
            return cb(results);
        }]));
    };
    createInstance = function(row) {
        var data, instance;
        data = {
            _hasDbRow: true
        };
        for (k in connections) {
            v = connections[k];
            data[k] = row[v[0]];
        }
        data.id = row.id;
        data.createdAt = row.created_at;
        instance = Model(data);
        return instance;
    };
    return Model;
};

_ensureSchema = function(tableName, connections, cb) {
    var c, k, v;
    c = {};
    for (k in connections) {
        v = connections[k];
        c[k] = v;
    }
    return ensureTableExists(tableName, function() {
        return ensureColumns(tableName, c, function() {
            return cb();
        });
    });
};

ensureTableExists = function(tableName, cb) {
    return query("SELECT EXISTS ( SELECT 1 FROM     information_schema.tables WHERE    table_schema = 'public' AND table_name = '" + tableName + "' );", function(rows) {
        if (rows[0].exists) {
            return cb();
        } else {
            return query("CREATE TABLE " + tableName + " ( id text, created_at timestamp ); CREATE TABLE graveyard_" + tableName + " ( id text, created_at timestamp, is_deleted boolean ); CREATE UNIQUE INDEX " + tableName + "_id on " + tableName + " (id); CREATE INDEX " + tableName + "_createdAt on " + tableName + " (created_at DESC);", function() {
                return cb();
            });
        }
    });
};

ensureColumns = function(tableName, connections, cb) {
    var columnName, dataType, k, keys, ref;
    keys = Object.keys(connections);
    if (keys.length === 0) {
        return cb();
    } else {
        k = keys[0];
        if (k === 'id') {
            delete connections[k];
            ensureColumns(tableName, connections, cb);
            return;
        }
        ref = connections[k], columnName = ref[0], dataType = ref[1];
        return query("SELECT data_type FROM information_schema.columns WHERE table_name='" + tableName + "' and column_name='" + columnName + "';", function(rows) {
            if (rows.length === 1) {
                if (rows[0].data_type === dataType) {
                    delete connections[k];
                    return ensureColumns(tableName, connections, cb);
                } else {
                    throw Error("Expected " + tableName + "." + columnName + " to be of data type " + dataType + ", but it was " + rows[0].data_type);
                }
            } else {
                return query("ALTER TABLE " + tableName + " ADD " + columnName + " " + dataType + "; ALTER TABLE graveyard_" + tableName + " ADD " + columnName + " " + dataType + ";", function() {
                    delete connections[k];
                    return ensureColumns(tableName, connections, cb);
                });
            }
        });
    }
};

export default ModelFactory
