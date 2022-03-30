
### 技术栈
Framework: Express

db: postgresql

ORM: sequelize

Cache: redis

ECMAScript: ES6

### 项目运行

环境：
- node >=8, 推荐LTS 10+
- postgresql >= 14.2
- redis 

```
//copy config.js，config.js为本地配置文件，加入了gitignore
$ cp config.default.js config.js

$ npm install

//mysql中手动建数据库，执行以下命令同步表
$ node dbsync

// models/sql/express_admin_init.sql 执行并初始化数据
// 默认初设账户admin/admin, test/test
$ npm start

```
