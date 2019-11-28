const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

const getPostData = (req) => {
    const promise = new Promise((resolve,reject) => {
        if (req.method !== 'POST'){
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json'){
            resolve({})
            return
        }

        let postData = ''
        req.on('data',chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData){
                resolve({})
                return
            }
            resolve(JSON.parse(postData))
        })
    })
    return promise
}

const serverHandler = (req, res) => {
    res.setHeader('content-type','application/json')

    const url = req.url
    req.path = url.split('?')[0]
    req.query = querystring.parse(url.split('?')[1])

    //解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ""
    cookieStr.split(";").forEach(item => {
        if(!item){
            return
        }
        const arr = item.split("=")
        const key = arr[0]
        const val = arr[1]
        req.cookie[key] = val
    })
    // console.log("cookie is",req.cookie);
    
    //解析session
    const needSetCookie = false
    const userId = req.cookie.userid
    if(userId) {
        if(!SESSION_DATA[userId]) {
            SESSION_DATA = {}
        }
    } else {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        SESSION_DATA[userId] = {}
    }
    req.session = SESSION_DATA[userId]

    //post data
    getPostData(req).then(postData => {
        // console.log("J",postData);
        req.body = postData
        //处理blog路由
        const blogResult = handleBlogRouter(req,res)

        if (blogResult){
            blogResult.then(blogData => {
                if(needSetCookie) {
                    res.setHeader('Set-Cookie', `username=${data.username}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }
    
        const userResult = handleUserRouter(req,res)
        if (userResult){
            userResult.then(userData => {
                if(needSetCookie) {
                    res.setHeader('Set-Cookie', `username=${data.username}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(JSON.stringify(userData))
            })
            return
        }
    
        res.writeHead(404, {'content-type': 'text/plain'})
        res.write('404 not found\n')
        res.end()

    })
    
   
}

module.exports = serverHandler
