'use strict';
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    let DictItem = sequelize.define('dict_item', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },        
        value: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
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

    return DictItem;
};