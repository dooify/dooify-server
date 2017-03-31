import url from 'url'
import pg from 'pg'
import colors from 'colors'

const params = url.parse(process.env.DATABASE_URL || 'postgres://mika:mika@localhost/mika')
const auth = params.auth.split(':')
const config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true,
    max: 5,
    idleTimeoutMillis: 30000
};

const pool = new pg.Pool(config);

const Query = (query, ...args) => new Promise( (resolve, reject) => {
    // convert camelcase to snake case
    query = query.replace(/[a-z]+[A-Z]\w+/g, (t) =>
        t.replace(/[A-Z]/g, (t2) => "_"+t2.toLowerCase() )
    )
    pool.connect(function(err, client, done) {
        if (err) {
            console.log('Err in SQL connect!')
            throw err;
        }

        let timing = new Date().getTime()
        client.query(query, args, function(err, results) {
            var ref, rows, sql, table;
            if (err) {
                throw err;
            }
            timing = new Date().getTime() - timing;
            if (timing > 50) {
                ref = sqlify(query, args), table = ref[0], sql = ref[1];
                rows = (results.rows.length.toString()) + " row";
                if (results.rows.length > 1) {
                    rows += "s";
                }
                rows = pad(rows, 8).magenta;
                console.log(pad(timing + "ms ", 6).cyan, table, rows, sql);
            }
            done();
            resolve(results.rows.map( (row) => camelize(row)))
        });
    });
});

Query.end = function() {
    return pg.end();
};

export default Query

function camelize (row) {
    const camel = {}
    for (let k in row) {
        camel[k.replace(/_[a-z]/g, (t) => t.slice(1).toUpperCase())] = row[k]
    }
    return camel
}

function sqlify(h, args) {
    var a, arg, e, i, j, len, m, tableName;
    tableName = (m = /(from|into) (\w+)/i.exec(h)) && m[2] || 'other';
    try {
        for (i = j = 0, len = args.length; j < len; i = ++j) {
            arg = args[i];
            a = (JSON.stringify(arg) || 'null').replace(/^"|"$/g, "'");
            if (a.length > 150) {
                a = a.slice(0, 151) + "...'";
            }
            h = h.replace('$' + (i + 1), a);
        }
    } catch (error) {
        e = error;
        return e;
    }
    h = h.replace(/from |select |delete |insert into| where| limit| order by| asc| desc/ig, function(s) {
        return s.toUpperCase().green;
    });
    h = h.replace(/,/g, ','.green);
    h = h.replace(/'.*?'/g, function(s) {
        return s.yellow;
    });
    return [pad("(" + tableName + ")", 20).red, h];
};

function pad(str, num) {
    while (str.length < num) {
        str = str + " ";
    }
    return str;
};
