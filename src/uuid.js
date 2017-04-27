const uuid = require('uuid/v4')

export default function u() {
    return uuid().replace(/-/g,'')
}
