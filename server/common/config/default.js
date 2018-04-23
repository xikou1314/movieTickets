//数据库连接


import path from 'path';

const rootPath = path.join(__dirname, '../../..');
export default {
  rootPath,
  publicPath: '/public',
  staticPath: '/static',
  title:'电影',
  port: 3000,
  db: {
    dialect:'mysql',
    username: 'yh',
    password: '1234',
    database: 'filmsdata',
    host:'localhost',
    port:3306
  }
};
