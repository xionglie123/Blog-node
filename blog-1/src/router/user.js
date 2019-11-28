const {login} = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/resModel')

const getCookieExpires = () => {
    const d = new Date()
    d.setTime = (d.getTime() + (24*60*60*1000))
    return d.toGMTString()
}

const handleUserRouter = (req,res) => {
    const method = req.method
    
    //log in
    if (method === 'GET' && req.path === '/api/user/login'){
        const {username, password} = req.query
        // const {username, password} = {"name":"Neo","password":"123"}
        const result = login(username,password)
        return result.then(data => {
            if (data.username) {
                req.session.username = data.username
                req.session.realname = data.realname
                return new SuccessModel()
            }
            return new ErrorModel('failure in login')
        })
        
    }
}

module.exports = handleUserRouter