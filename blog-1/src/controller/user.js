const {exec} = require('../db/mysql')
const login = (username, password) => {
    //mock data
    // if (username === 'Neo' && password === '123'){
    //     return true
    // }
    // return false
    const sql = `
    select username, realname from users where username='${username}'
     and password='${password}'`

    return exec(sql).then(rows => {
        console.log(rows);
        
        return rows[0] || {}
    })
}

module.exports = {
    login
}