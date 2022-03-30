const _ = require('lodash'),
    crypto = require('crypto'),
    // logger = require('../common/logger'),
    tool = require('../common/tool'),
    models = require('../models'),
    Op = models.Sequelize.Op;

class DictController {
    /** 获取字典分页数据*/
    async getDictPage (req, res, next) {
        let offset = +req.query.offset || 0,
            limit = +req.query.limit || 15;

        const data = await models.dict.findAndCountAll({
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
    /** 获取字典项分页数据*/
    async getDictItemPage (req, res, next) {
        let offset = +req.query.offset || 0,
            limit = +req.query.limit || 15;

        const data = await models.dict_item.findAndCountAll({
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
    /** 获取字典项所有数据*/
    async getDictItemData (req, res, next) {
        const data = await models.dict_item.findAndCountAll({
            where: tool.setWhereParams(req.query)
        });
        res.send({
            code: 200,
            message: '',
            result:  data.rows,
            success: true,
            timestamp: Date.now()
        });
    }

    /** 删除字典 */
    async deleteDict (req, res, next) {
        let id = req.params.id;
        await models.dict.destroy({
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
    /** 删除字典项 */
    async deleteDictItem (req, res, next) {
        let id = req.params.id;
        await models.dict_item.destroy({
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
    async addDict(req,res,next) {
        let resultBl = await models.dict.create({
            name: req.body.name,
            code: req.body.code,
            introduce: req.body.introduce
        })
        DictController.setReturnRes(res,resultBl.dataValues ? true : false, '新增')
    }
    async addDictItem(req,res,next) {
        let resultBl = await models.dict_item.create({
            name: req.body.name,
            code: req.body.code,
            value: req.body.value
        })
        DictController.setReturnRes(res,resultBl.dataValues ? true : false, '新增')
    }
    async updateDict(req,res,next) {
        let resultBl = await models.dict.update({
            name: req.body.name,
            code: req.body.code,
            introduce: req.body.introduce
        }, {
            where: {
                id: req.params.id
            }
        })
        DictController.setReturnRes(res,resultBl.length > 0 ? true : false,'修改')
    }
    async updateDictItem(req,res,next) {
        let resultBl = await models.dict_item.update({
            name: req.body.name,
            code: req.body.code,
            value: req.body.value
        }, {
            where: {
                id: req.params.id
            }
        })
        DictController.setReturnRes(res,resultBl.length > 0 ? true : false,'修改')
    }
    static setReturnRes(res,resultBl,message) {
        if (resultBl) {
            res.send({
                code: 200,
                message: message + '成功',
                result: '',
                success: true,
                timestamp: Date.now()
            })
        } else {
            res.send({
                code: 500,
                message: message + '失败',
                result: resultBl,
                success: false,
                timestamp: Date.now()
            })
        }
    }
}

module.exports = new DictController();