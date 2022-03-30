'use strict';

module.exports = {
  debug: true,
  host: 'localhost',
  port: 9001,
  session_secret: 'node_express_admin',
  site: {
    name: '后台权限管理系统', // 名称
    description: '后台权限管理系统', // 描述
    keywords: 'Node.js, Express',
  },
  // sqldb
  sqldb: {
    // db: 'mysql',
    db: 'postgres',
    host: '127.0.0.1',
    database: 'acltest',
    username: 'postgres',
    password: '561610',
    port: 5432
    // timezone: '+08:00' //for writing to database
  },
  // redis
  redis: {
    host: '127.0.0.1',
    port: 6379,
    db: 0,
    pass: '',
  }
};