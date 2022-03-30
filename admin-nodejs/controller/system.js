const _ = require('lodash'),
    crypto = require('crypto'),
    logger = require('../common/logger'),
    tool = require('../common/tool'),
    models = require('../models'),
    sequelize = models.Sequelize,
    Op = models.Sequelize.Op;

/** 系统管理控制器 */
class systemController {
    //#region  用户管理
    
    /**用户管理页面 */
    async showUserList (req, res, next) {
        res.render("system/user-list", {
            pageTitle: "用户管理"
        });
    }
    

    /** 获取用户分页数据*/
    async getUserPage (req, res, next) {
        let offset = +req.query.offset || 0,
            limit = +req.query.limit || 15;

        const data = await models.user.findAndCountAll({
            where: tool.setWhereParams(req.query),
            limit: limit,
            offset: offset
        });
        res.send({
            code: 200,
            message: '',
            result: { data: data.rows, total: data.count },
            success: true,
            timestamp: Date.now()
        });
    }

    /**显示用户编辑页面 */
    async showUserEdit (req, res, next) {
        let id = req.params.id;
        if (id == 0) {
            res.render('system/user-edit', {
                pageTitle: "用户管理",
                action: 'add'
            });
        } else {
            let model = await models.user.findByPk(id);
            if (!model) throw Error("没有找到该用户！");
            res.render('system/user-edit', {
                pageTitle: "用户管理",
                action: 'edit',
                model: model
            });
        }
    }

    /**修改密码 */
    async updatePwd (req, res, next) {
        let userInfo = await models.user.findByPk(req.session.user.id)
        if (userInfo.login_password !== crypto.createHash('md5').update(req.body.old_password).digest('hex')) {
            res.send({
                code: 500,
                message: "原密码不正确",
                result: '',
                success: false,
                timestamp: Date.now()
            });
        } else {
            await models.user.update({
                login_password: crypto.createHash('md5').update(req.body.new_password).digest('hex'),
            }, {
                where: {
                    id: req.session.user.id,
                }
            })
            res.send({
                code: 200,
                message: "修改成功",
                result: '',
                success: true,
                timestamp: Date.now()
            });
        }

    }
    /**重置密码 */
    async resetPwd (req, res, next) {
        await models.user.update({
            login_password: crypto.createHash('md5').update('123456').digest('hex'),
        }, {
            where: {
                id: req.params.id
            }
        })
        res.send({
            code: 200,
            message: "重置成功",
            result: '',
            success: true,
            timestamp: Date.now()
        });
    }

    /** 保存编辑用户数据 */
    async saveUserEdit (req, res, next) {
        let id = req.params.id;
        if (id == 0) {
            let branch_id = req.body.branch_id || 0;
            // let branch_model = await models.branch.findByPk(branch_id);

            //检查用户名
            let usr = await models.user.findAll({
                where: {
                    login_name: req.body.login_name
                }
            });
            if (usr.length > 0) {
                res.send({
                    code: 500,
                    message: '用户名已存在！',
                    result: null,
                    success: false,
                    timestamp: Date.now()
                });
                return;
            }
            //新增
            await models.user.create({
                login_name: req.body.login_name || '',
                login_password: crypto.createHash('md5').update('123456').digest('hex'),
                branch_id: branch_id,
                branch_name: '',
                position_id: req.body.position_id || '',
                position_name: '',
                real_name: req.body.real_name || '',
                mobile: req.body.mobile || '',
                is_enabled: req.body.is_enabled
            });
        } else {
            //编辑
            let model = await models.user.findByPk(id);
            if (typeof (req.body.login_name) !== 'undefined') {
                //检查用户名
                let usr = await models.user.findAll({
                    where: {
                        id: {
                            [Op.ne]: id
                        },
                        login_name: req.body.login_name
                    }
                });
                if (usr.length > 0) {
                    res.send({
                        code: 500,
                        message: '用户名已存在！',
                        result: null,
                        success: false,
                        timestamp: Date.now()
                    });
                    return;
                }
                model.login_name = req.body.login_name;
            }
            if (typeof (req.body.branch_id) !== 'undefined')
                model.branch_id = req.body.branch_id;
            if (typeof (req.body.position_id) !== 'undefined')
                model.position_id = req.body.position_id;
            if (typeof (req.body.real_name) !== 'undefined')
                model.real_name = req.body.real_name;
            if (typeof (req.body.mobile) !== 'undefined')
                model.mobile = req.body.mobile;
            if (typeof (req.body.is_enabled) !== 'undefined')
                model.is_enabled = req.body.is_enabled;
            await model.save();
        }
        res.send({
            code: 200,
            message: '保存成功！',
            result: null,
            success: true,
            timestamp: Date.now()
        });
    }

    /** 删除用户 */
    async deleteUser (req, res, next) {
        let id = req.params.id;
        await models.user.destroy({
            where: {
                id: id
            }
        });
        res.send({
            code: 200,
            message: '删除成功！',
            result: null,
            success: true,
            timestamp: Date.now()
        });
    }
    /**获取所有部门和角色 */
    async getUserBranchRole (req, res, next) {
        let branch = await models.branch.findAll()
        let role = await models.position.findAll()
        res.send({
            code: 200,
            message: '',
            result: { branch: branch, role: role },
            success: true,
            timestamp: Date.now()
        })
    }
    //#endregion 


    //#region  菜单管理

    /**菜单管理页面 */
    async showMenuList (req, res, next) {
        res.render("system/menu-list", {
            pageTitle: "菜单管理"
        });
    }

    /** 获取菜单分页数据*/
    async getMenuPage (req, res, next) {
        // let offset = +req.query.offset || 0,
        // limit = +req.query.limit || 15;

        const data = await models.menu.findAndCountAll({
            where: {},
            // limit: limit,
            // offset: offset
        });
        let topArr = []
        for (let item of data.rows) {
            if (item.level === 0) {
                systemController.setTreeData(item.dataValues, data.rows)
                topArr.push(item)
            }
        }
        res.send({
            code: 200,
            message: '',
            result: topArr,
            success: true,
            timestamp: Date.now()
        });
    }
    static setTreeData (obj, originData, level = 1) {
        for (let i = 0, l = originData.length; i < l; i++) {
            if (obj.id === originData[i].parent_id && originData[i].level === level) {
                if (obj['children']) obj['children'].push(originData[i].dataValues)
                else obj['children'] = [originData[i].dataValues]
                const nLeven = level + 1
                systemController.setTreeData(originData[i].dataValues, originData, nLeven)
            } else continue
        }
    }

    /**显示菜单编辑页面 */
    async showMenuEdit (req, res, next) {
        let id = req.params.id;
        if (id == 0) {
            res.render('system/menu-edit', {
                pageTitle: "菜单管理",
                action: 'add'
            });
        } else {
            let model = await models.menu.findByPk(id);
            if (!model) throw Error("没有找到菜单！");
            res.render('system/menu-edit', {
                pageTitle: "菜单管理",
                action: 'edit',
                model: model,
            });
        }
    }

    /** 保存编辑菜单数据 */
    async saveMenuEdit (req, res, next) {
        let id = req.params.id;
        let resultBl = null
        if (id == 0) {
            //设置层级
            let level = 0;
            let parent_id = req.body.parent_id || 0;
            if (parent_id == 0) {
                level = 0;
            } else {
                //层级为parent_id的level+1
                let parent_model = await models.menu.findByPk(parent_id);
                level = parent_model.level + 1;
            }
            //设置排序
            let sort = req.body.sort || 0;
            if (sort == 0) {
                const max = await models.menu.max('sort', {
                    where: {
                        parent_id: parent_id
                    }
                });
                sort = max + 1;
            }
            //新增
            resultBl = await models.menu.create({
                name: req.body.name,
                page_url: req.body.page_url || '',
                control_url: req.body.control_url || '',
                parent_id: parent_id,
                level: level,
                sort: sort,
                is_show: req.body.is_show,
                is_enabled: req.body.is_enabled,
                icon: req.body.icon,
                component: req.body.component
            });
        } else {
            //编辑
            let model = await models.menu.findByPk(id);
            model.component = req.body.component
            model.icon = req.body.icon
            model.name = req.body.name
            model.page_url = req.body.page_url
            model.control_url = req.body.control_url
            model.parent_id = req.body.parent_id
            model.sort = req.body.sort;
            model.is_show = req.body.is_show;
            model.is_enabled = req.body.is_enabled;
            if (model.parent_id == 0) {
                model.level = 0;
            } else {
                //层级为parent_id的level+1
                let parent_model = await models.menu.findByPk(model.parent_id);
                model.level = parent_model.level + 1;
            }

            resultBl = await model.save();
        }
        if (resultBl.dataValues) {
            res.send({
                code: 200,
                message: '',
                result: '保存成功',
                success: true,
                timestamp: Date.now()
            })
        } else {
            res.send({
                code: 500,
                message: '',
                result: resultBl,
                success: false,
                timestamp: Date.now()
            })
        }

    }


    /**获取上级菜单下拉数据 */
    async getMenuSelectJson (req, res, next) {
        try {
            let data = [];
            const menuAll = await models.menu.findAll({
                where: {},
            });
            let result = menuAll.reduce(function (prev, item) {
                prev[item.parent_id] ? prev[item.parent_id].push(item) : prev[item.parent_id] = [item];
                return prev;
            }, {});
            if (Object.keys(result).length > 0) {
                data = tool.resolvSelectJson(result, result[0]);
            }
            res.send({
                code: 200,
                message: '',
                result: data,
                success: true,
                timestamp: Date.now()
            });
        } catch (err) {
            logger.error(err.message, err);
            res.send({
                code: 200,
                message: '',
                result: [],
                success: true,
                timestamp: Date.now()
            });
        }
    }


    /**获取菜单树数据 */
    async getMenuTreeJson (req, res, next) {
        try {
            const data = await models.menu.findAll({
                where: {
                    is_enabled: 1
                },
            });
            res.send({
                code: 200,
                message: '',
                result: data,
                success: true,
                timestamp: Date.now()
            });
        } catch (err) {
            logger.error(err.message, err);
            res.send({
                code: 200,
                message: '',
                result: [],
                success: true,
                timestamp: Date.now()
            });
        }
    }

    /**获取菜单树数据By用户 */
    async getMenuTreeJsonByUser (req, res, next) {
        try {
            if (!req.session || !req.session.menu || req.session.menu.length == 0) {
                res.send({
                    code: 200,
                    message: '',
                    result: [],
                    success: true,
                    timestamp: Date.now()
                });
                return;
            }
            let menu = req.session.menu;
            //排除不显示的菜单项
            menu = _.filter(menu, {
                is_show: 1
            });
            let result = menu.reduce(function (prev, item) {
                prev[item.parent_id] ? prev[item.parent_id].push(item) : prev[item.parent_id] = [item];
                return prev;
            }, {});
            //输出树型结构json
            for (let prop in result) {
                result[prop].forEach(function (item, i) {
                    result[item.id] ? item.children = result[item.id] : ''
                });
            }
            result = result[0];
            res.send({
                code: 200,
                message: '',
                result: result,
                success: true,
                timestamp: Date.now()
            });
        } catch (err) {
            logger.error(err.message, err);
            res.send({
                code: 500,
                message: err.message,
                result: [],
                success: true,
                timestamp: Date.now()
            });
        }
    }

    /** 删除菜单 */
    async deleteMenu (req, res, next) {
        let id = req.params.id;
        //删除前判断是否有子项
        const submenu = await models.menu.findAll({
            where: {
                parent_id: id
            },
        });
        if (submenu.length > 0) {
            res.send({
                code: 500,
                message: '删除失败，存在子项，不能直接删除！',
                result: null,
                success: false,
                timestamp: Date.now()
            });
            return;
        }
        //检查职位中有关menu_id的绑定
        const position = await models.position.findAll();
        for (let i = 0; i < position.length; i++) {
            let menu = ',' + position[i].menu_id + ',';
            if (menu.indexOf(',' + id + ',') > -1) {
                res.send({
                    code: 500,
                    message: "删除失败，职位" + position[i].name + "已绑定该菜单，请先解绑后删除！",
                    result: null,
                    success: false,
                    timestamp: Date.now()
                });
                return;
            }
        }

        await models.menu.destroy({
            where: {
                id: id
            }
        });
        res.send({
            code: 200,
            message: "删除成功！",
            result: null,
            success: true,
            timestamp: Date.now()
        });
    }


    //#endregion 


    //#region  部门管理

    /**部门管理页面 */
    async showBranchList (req, res, next) {
        res.render("system/branch-list", {
            pageTitle: "部门管理"
        });
    }

    /** 获取部门分页数据*/
    async getBranchPage (req, res, next) {
        // let offset = +req.query.offset || 0,
        //     limit = +req.query.limit || 15;

        const data = await models.branch.findAndCountAll({
            where: {},
            // limit: limit,
            // offset: offset
        });
        let topArr = []
        for (let item of data.rows) {
            if (item.level === 0) {
                systemController.setTreeData(item.dataValues, data.rows)
                topArr.push(item)
            }
        }
        res.send({
            code: 200,
            message: "",
            result: topArr,
            success: true,
            timestamp: Date.now()
        });
    }

    // /**显示部门编辑页面 */
    async showBranchEdit (req, res, next) {
        let id = req.params.id;
        if (id == 0) {
            res.render('system/branch-edit', {
                pageTitle: "部门管理",
                action: 'add'
            });
        } else {
            let model = await models.branch.findByPk(id);
            if (!model) throw Error("没有找到部门！");
            res.render('system/branch-edit', {
                pageTitle: "部门管理",
                action: 'edit',
                model: model,
            });
        }
    }

    /** 保存编辑部门数据 */
    async saveBranchEdit (req, res, next) {
        let id = req.params.id;
        if (id == 0) {
            //设置层级
            let level = 0;
            let parent_id = req.body.parent_id || 0;
            if (parent_id == 0) {
                level = 0;
            } else {
                //层级为parent_id的level+1
                let parent_model = await models.branch.findByPk(parent_id);
                level = parent_model.level + 1;
            }
            //设置排序
            let sort = req.body.sort || 0;
            // if (sort == 0) {
            //     const max = await models.branch.max('sort', {
            //         where: {
            //             parent_id: parent_id
            //         }
            //     });
            //     sort = max + 1;
            // }
            //新增
            await models.branch.create({
                name: req.body.name,
                code: req.body.code || '',
                parent_id: parent_id,
                level: level,
                sort: sort
            });
        } else {
            //编辑
            let model = await models.branch.findByPk(id);
            if (typeof (req.body.name) !== 'undefined')
                model.name = req.body.name;
            if (typeof (req.body.code) !== 'undefined')
                model.code = req.body.code;
            if (typeof (req.body.parent_id) !== 'undefined')
                model.parent_id = req.body.parent_id;
            //level 重新计算
            if (model.parent_id == 0) {
                model.level = 0;
            } else {
                //层级为parent_id的level+1
                let parent_model = await models.branch.findByPk(model.parent_id);
                model.level = parent_model.level + 1;
            }
            if (typeof (req.body.sort) !== 'undefined')
                model.sort = req.body.sort;

            await model.save();

            //更新职位绑定的部门名称
            await models.position.update({
                branch_name: req.body.name
            }, {
                where: {
                    branch_id: id
                }
            })

        }
        res.send({
            code: 200,
            message: "保存成功！",
            result: '',
            success: true,
            timestamp: Date.now()
        });
    }

    // /**获取上级部门下拉数据 */
    async getBranchSelectJson (req, res, next) {
        try {
            let data = [];
            const all = await models.branch.findAll({
                where: {},
            });
            let result = all.reduce(function (prev, item) {
                prev[item.parent_id] ? prev[item.parent_id].push(item) : prev[item.parent_id] = [item];
                return prev;
            }, {});
            if (Object.keys(result).length > 0) {
                data = tool.resolvSelectJson(result, result[0]);
            }
            res.send({
                code: 200,
                message: "",
                result: data,
                success: true,
                timestamp: Date.now()
            });
        } catch (err) {
            logger.error(err.message, err);
            res.send({
                code: 200,
                message: "",
                result: [],
                success: true,
                timestamp: Date.now()
            });
        }
    }

    // /**获取部门树数据 */
    async getBranchTreeJson (req, res, next) {
        try {
            const data = await models.branch.findAll({
                where: {},
            });
            res.send({
                code: 200,
                message: "",
                result: data,
                success: true,
                timestamp: Date.now()
            });
        } catch (err) {
            logger.error(err.message, err);
            res.send({
                code: 200,
                message: "",
                result: [],
                success: true,
                timestamp: Date.now()
            });
        }
    }

    /** 删除部门 */
    async deleteBranch (req, res, next) {
        let id = req.params.id;
        //删除前判断是否有子项
        const sub = await models.branch.findAll({
            where: {
                parent_id: id
            },
        });
        if (sub.length > 0) {
            res.send({
                code: 500,
                message: "删除失败，存在子项，不能直接删除！",
                result: '',
                success: false,
                timestamp: Date.now()
            });
            return;
        }
        //检查职位中有关branch_id的绑定
        const pos = await models.position.findAll({
            where: {
                branch_id: id
            },
        });
        if (pos.length > 0) {
            res.send({
                code: 500,
                message: "删除失败，职位中已绑定该部门，请先解绑后删除！",
                result: '',
                success: false,
                timestamp: Date.now()
            });
            return;
        }
        //检查用户中有关branch_id的绑定
        const usr = await models.user.findAll({
            where: {
                branch_id: id
            },
        });
        if (usr.length > 0) {
            res.send({
                code: 500,
                message: "删除失败，用户中已绑定该部门，请先解绑后删除！",
                result: '',
                success: false,
                timestamp: Date.now()
            });
            return;
        }

        await models.branch.destroy({
            where: {
                id: id
            }
        });
        res.send({
            code: 200,
            message: "删除成功！",
            result: '',
            success: true,
            timestamp: Date.now()
        });
    }
    //#endregion 


    //#region  职位管理

    /**职位管理页面 */
    async showPositionList (req, res, next) {
        res.render("system/position-list", {
            pageTitle: "职位管理"
        });
    }

    /** 获取职位分页数据*/
    async getPositionPage (req, res, next) {
        let offset = (req.query.pageNo - 1) * req.query.pageSize || 0,
            limit = req.query.pageSize || 15,
            branch_id = +req.query.branch_id || 0;
        let condition = {};
        if (branch_id > 0) {
            condition = {
                branch_id: branch_id
            }
        }
        const data = await models.position.findAndCountAll({
            where: condition,
            limit: limit,
            offset: offset
        });
        res.send({
            code: 200,
            message: "",
            result: { data: data.rows, total: data.count },
            success: true,
            timestamp: Date.now()
        });
    }


    /**显示职位编辑页面 */
    async showPositionEdit (req, res, next) {
        let id = req.params.id;
        if (id == 0) {
            res.render('system/position-edit', {
                pageTitle: "职位管理",
                action: 'add'
            });
        } else {
            let model = await models.position.findByPk(id);
            if (!model) throw Error("没有找到职位！");
            res.render('system/position-edit', {
                pageTitle: "职位管理",
                action: 'edit',
                model: model,
            });
        }
    }
    /** 角色授权 */
    async roleAuth (req, res, next) {
        let id = req.params.id
        // let resultBl = await models.position.findByPk(id)
        let resultBl = await models.position.update({ menu_id: req.body.menu_id }, { where: { id: id } })
        if (resultBl.length > 0) {
            res.send({
                code: 200,
                message: "授权成功",
                result: '',
                success: true,
                timestamp: Date.now()
            });
        } else {
            res.send({
                code: 500,
                message: "授权失败！",
                result: '',
                success: false,
                timestamp: Date.now()
            });
        }

    }

    /** 保存编辑职位数据 */
    async savePositionEdit (req, res, next) {
        let id = req.params.id;
        let resultBl = null
        if (id == 0) {
            // let branch_id = req.body.branch_id || 0;
            // let branch_model = await models.branch.findByPk(branch_id);
            // let menu_id = req.body.menu_id || '';

            //新增
            resultBl = await models.position.create({
                name: req.body.name,
                key: req.body.key
                // branch_id: branch_id,
                // branch_name: !branch_model ? '' : branch_model.name,
                // menu_id: menu_id
            });
        } else {
            //编辑
            let model = await models.position.findByPk(id);
            if (typeof (req.body.name) !== 'undefined')
                model.name = req.body.name;
            model.key = req.body.key
            // if (typeof (req.body.branch_id) !== 'undefined') {
            //     model.branch_id = req.body.branch_id;
            //     //更新部门名称
            //     if (req.body.branch_id > 0) {
            //         let branch_model = await models.branch.findByPk(req.body.branch_id);
            //         model.branch_name = branch_model.name;
            //     }
            // }

            // if (typeof (req.body.menu_id) !== 'undefined')
            //     model.menu_id = req.body.menu_id;

            resultBl = await model.save();

            //更新用户中的职位名称
            // let sql = [],
            //     queryparams = {};
            // sql.push('SELECT * FROM `user` WHERE FIND_IN_SET(:pid,position_id)');
            // queryparams.pid = id;

            // let user = await models.sequelize.query(sql.join(''), {
            //     replacements: queryparams,
            //     type: sequelize.QueryTypes.SELECT
            // });
            // if (user.length > 0) {
            //     const positionAll = await models.position.findAll();
            //     user.forEach(async usr => {
            //         let array = usr.position_id.split(',');
            //         let position_name = "";
            //         array.forEach(ar => {
            //             let f = _.find(positionAll, ['id', _.toInteger(ar)]);
            //             if (f) {
            //                 position_name += f.name + ",";
            //             }

            //         });

            //         let user_model = await models.user.findByPk(usr.id);
            //         user_model.position_name = _.trimEnd(position_name, ',');

            //         user_model.save();
            //     });

            // }

        }
        if (resultBl && resultBl.dataValues) {
            res.send({
                code: 200,
                message: "保存成功！",
                result: '',
                success: true,
                timestamp: Date.now()
            });
        } else {
            res.send({
                code: 500,
                message: "保存失败！",
                result: '',
                success: false,
                timestamp: Date.now()
            });
        }

    }

    /** 删除职位 */
    async deletePosition (req, res, next) {
        let id = req.params.id;
        //检查用户中有关position_id的绑定
        const usr = await models.user.findAll({
            where: {},
        });
        for (let i = 0; i < usr.length; i++) {
            let pos = ',' + usr[i].position_id + ',';
            if (pos.indexOf(',' + id + ',') > -1) {
                res.send({
                    code: 500,
                    message: "删除失败，用户" + usr[i].login_name + "已绑定该职位，请先解绑后删除！",
                    result: '',
                    success: false,
                    timestamp: Date.now()
                });
                return;
            }
        }

        await models.position.destroy({
            where: {
                id: id
            }
        });
        res.send({
            code: 200,
            message: "删除成功",
            result: '',
            success: true,
            timestamp: Date.now()
        });
    }

    /**获取职位树数据（职位挂在部门下，部门不能选） */
    async getPositionTreeJson (req, res, next) {
        try {
            const data = [];
            const branch = await models.branch.findAll();
            const position = await models.position.findAll();
            branch.forEach(item => {
                data.push({
                    id: item.id,
                    name: item.name,
                    parent_id: item.parent_id,
                    nocheck: true
                });
            })
            position.forEach(item => {
                data.push({
                    pid: item.id,
                    name: item.name,
                    parent_id: item.branch_id,
                });
            })
            res.send({
                code: 200,
                message: "",
                result: data,
                success: true,
                timestamp: Date.now()
            });
            // res.send(data);
        } catch (err) {
            logger.error(err.message, err);
            res.send({
                code: 200,
                message: "",
                result: [],
                success: true,
                timestamp: Date.now()
            });
            // res.send([]);
        }
    }
    // #endregion


}

module.exports = new systemController();