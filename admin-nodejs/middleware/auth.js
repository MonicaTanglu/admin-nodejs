class authMiddleware {
    /** 需要用户登录*/
    async loginRequired (req, res, next) {
        if (!req.session || !req.session.user || !req.session.user.id) {
            // return res.redirect('/login');
            res.status(401).send({
                code: 401, 
                message: '登录过期，请重新登录', 
                result: null, 
                success: false,
                timestamp: Date.now()
            })
            return
        }
        await next();
    }

    /** 用户鉴权*/
    async authUserPermission (req, res, next) {
        if (!req.session || !req.session.user || !req.session.user.id) {
            // return res.redirect('/login');
            res.status(401).send({
                code: 401, 
                message: '登录过期，请重新登录', 
                result: null, 
                success: false,
                timestamp: Date.now()
            })
            return
        }
        if (!req.session || !req.session.menu || req.session.menu.length == 0) {
            return res.send({
                success: false,
                code: 500,
                message: "抱歉，您无此权限！请联系管理员",
                timestamp: Date.now()
            });
        }
        let targetUrl = req.route.path;
        let hasPower = false;
        req.session.menu.forEach(el => {
            if (el.page_url == targetUrl || el.control_url == targetUrl) {
                hasPower = true;
            }

        });
        if (!hasPower) {
            if (req.xhr) {
                return res.json({
                    success: false,
                    code: 500,
                    message: "抱歉，您无此权限！请联系管理员",
                    timestamp: Date.now()
                });
            }

            return res.send({
                success: false,
                code: 500,
                message: "抱歉，您无此权限！请联系管理员",
                timestamp: Date.now()
            });
        }
        next();
    }

}

module.exports = new authMiddleware();