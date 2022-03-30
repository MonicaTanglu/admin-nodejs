'use strict';
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    let Branch = sequelize.define('branch', {
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
        /**上一级部门id */
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        /**层级 */
        level: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        /**排序 */
        sort: {
            type: DataTypes.INTEGER,
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

    return Branch;
};