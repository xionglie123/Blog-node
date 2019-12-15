const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog} = require('../controller/blog')
const {SuccessModel, ErrorModel} = require('../model/resModel')

// 统一的登陆验证函数
const logincheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel("尚未登陆")
        )
    }
}


const handleBlogRouter = (req,res) => {
    const method = req.method;
    const id = req.query.id

    //get blog list
    if (method === 'GET' && req.path === '/api/blog/list'){
        let author = req.query.author || ''
        const keyword = req.query.keyword || ''
        // const listData = getList(author,keyword)
        // return new SuccessModel(listData)

        if (req.query.isadmin) {
            // 管理员界面
            const loginCheckResult = logincheck(req)
            if (loginCheckResult) {
                return loginCheckResult
            }
            // 强制查询自己的博客
            author = req.session.username;
        }
        const result = getList(author,keyword)
        return result.then(listData => {
            return new SuccessModel(listData)
        })
    }

    //get blog list detail
    if (method === 'GET' && req.path === '/api/blog/detail'){
        const result = getDetail(id)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    // new blog
    if (method === 'POST' && req.path === '/api/blog/new'){
        // const data = newBlog(req.body)
        // return new SuccessModel(data)
        const loginCheckResult = logincheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }

        req.body.author = req.session.username //mock author
        const result = newBlog(req.body)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    //update blog
    if (method === 'POST' && req.path === '/api/blog/update'){
        const loginCheckResult = logincheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }

        const result = updateBlog(id, req.body)
        return result.then(val => {
            if(val){
                return new SuccessModel()
            }else{
                return new ErrorModel('failure to update ')
            }
        })
        
    }

    //delete blog
    if (method === 'POST' && req.path === '/api/blog/del'){
        const loginCheckResult = logincheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }
        const author = req.session.username
        const result = deleteBlog(id, author)
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel('failure to delete')
            }
        })
        
    }
}

module.exports = handleBlogRouter