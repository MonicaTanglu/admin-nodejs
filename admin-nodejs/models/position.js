'use strict';
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    let Position = sequelize.define('position', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        /**角色名称 */
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        /**角色key */
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        /**部门id（单个） */
        branch_id: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 0
        },
        /**部门名称 */
        branch_name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        /**菜单权限集合（1,2,3,4） */
        menu_id: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        created_time: {
            type: DataTypes.DATE,
            // get() {
            //     return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            // }
        },
        updated_time: {
            type: DataTypes.DATE,
            // get() {
            //     return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
            // }
        }
    }, {
        freezeTableName: true,
        createdAt: 'created_time',
        updatedAt: 'updated_time'
    });

    return Position;
};