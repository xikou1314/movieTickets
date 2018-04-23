import config from '../common/config';
//引入框架
import Sequelize from 'sequelize';
//初始化连接池
const cls = require('continuation-local-storage'),
    namespace = cls.createNamespace('my-very-own-namespace');
    Sequelize.useCLS(namespace);
export const sequelize=new Sequelize(config.db.database,config.db.username,config.db.password,{
    dialect: config.db.dialect,
    host:config.db.host,
    port:config.db.port,
    pool:{
        max:10,
        min:0,
        idle:10000
    }
}
);
