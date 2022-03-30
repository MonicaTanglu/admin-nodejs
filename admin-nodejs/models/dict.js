'use strict';
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    let Dict = sequelize.define('dict', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        /**部门名称 */
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        /**部门编码（第一级01，第二级0101，依次类推） */
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 0
        },        
        /**排序 */
        introduce: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 0
        },
        created_time: {
            type: DataTypes.DATE,
            // get() {
            //     return moment(this.getDataValue('created_time')).format('YYYY-MM-DD HH:mm:ss');
            // }
        },
        updated_time: {
            type: DataTypes.DATE,
            // get() {
            //     return moment(this.getDataValue('updated_time')).format('YYYY-MM-DD HH:mm:ss');
            // }
        }
    }, {
        freezeTableName: true,
        createdAt: 'created_time',
        updatedAt: 'updated_time'
    });

    return Dict;
};