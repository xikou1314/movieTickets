import Router from 'koa-router';
import login from '../controllers/admin/login';
import updateAdminPwd from '../controllers/admin/updateAdminPwd';
import getFilmClass from '../controllers/admin/getFilmClass';
import getFilmArea from '../controllers/admin/getFilmArea';
import newFilm from '../controllers/admin/newFilm';
import filmList from '../controllers/admin/filmList';
import deleteFilm from '../controllers/admin/deleteFilm';
import filmDetail from '../controllers/admin/filmDetail';
import newUser from '../controllers/admin/newUser';
import deleteUser from '../controllers/admin/deleteUser';
import userDetail from '../controllers/admin/userDetail';
import newFilmRoom from '../controllers/admin/newFilmRoom';
import updateFilm from '../controllers/admin/updateFilm';
import testTransition from '../controllers/admin/testTransition';
import roomList from '../controllers/admin/roomList';
import deleteRoom from '../controllers/admin/deleteRoom';
import roomDetail from '../controllers/admin/roomDetail';
import seatInfo from '../controllers/admin/seatInfo';
import updateRoom from '../controllers/admin/updateRoom';
import selectFilm from '../controllers/admin/selectFilm';
import newArrange from '../controllers/admin/newArrange';
import arrangeList from '../controllers/admin/arrangeList';
import deleteArrange from '../controllers/admin/deleteArrange';
import deleteRole from '../controllers/admin/deleteRole';
import arrangeDetail from '../controllers/admin/arrangeDetail';
import updateArrange from '../controllers/admin/updateArrange';
import roleList from '../controllers/admin/roleList';
import userList from '../controllers/admin/userList';
import updateUser from '../controllers/admin/updateUser';
import modleList from '../controllers/admin/modleList';
import newRole from '../controllers/admin/newRole';
import roleListParam from '../controllers/admin/roleListParam';
import roleDetail from '../controllers/admin/roleDetail'
import updateRole from '../controllers/admin/updateRole';
import carouselList from '../controllers/admin/carouselList';
import newCarousel from '../controllers/admin/newCarousel';
import deleteCarousel from '../controllers/admin/deleteCarousel';
import updateCarousel from '../controllers/admin/updateCarousel';
const router = new Router();

const multer = require('koa-multer');//加载koa-multer模块  
//文件上传  
//配置  
var storage = multer.diskStorage({  
  //文件保存路径  
  destination: function (req, file, cb) {  
    cb(null, 'public/uploads/')  
  },  
  //修改文件名称  
  filename: function (req, file, cb) {  
    var fileFormat = (file.originalname).split(".");  
    cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);  
  }  
})  
//加载配置  
var upload = multer({ storage: storage });  
router.prefix('/api');




router.post('/login',login);
router.post('/updateUserPwd',updateAdminPwd);
router.get('/getFilmClass',getFilmClass);
router.get('/getFilmArea',getFilmArea);
router.post('/newFilm',newFilm);
router.post('/filmList',filmList);
router.delete('/deleteFilm',deleteFilm);
router.get('/filmDetail',filmDetail);
router.post('/newUser',newUser);
router.delete('/deleteUser',deleteUser);
router.get('/userDetail',userDetail);
router.post('/newFilmRoom',newFilmRoom);
router.post('/updateFilm',updateFilm);
router.get('/testTransition',testTransition);
router.get('/roomList',roomList);
router.delete('/deleteRoom',deleteRoom);
router.get('/roomDetail',roomDetail);
router.get('/seatInfo',seatInfo);
router.post('/updateRoom',updateRoom);
router.post('/newArrange',newArrange);
router.post('/updateUser',updateUser);
router.get('/selectFilm',selectFilm);
router.get('/arrangeList',arrangeList);
router.get('/arrangeDetail',arrangeDetail);
router.get('/updateArrange',updateArrange);
router.delete('/deleteArrange',deleteArrange);
router.delete('/deleteRole',deleteRole);
router.get('/roleList',roleList);
router.get('/userList',userList);
router.get('/roleDetail',roleDetail);
router.get('/modleList',modleList);
router.get('/roleListParam',roleListParam);
router.get('/carouselList',carouselList);
router.post('/newRole',newRole);
router.post('/updateRole',updateRole);
router.post('/updateCarousel',updateCarousel);
router.post('/newCarousel',newCarousel);
router.delete('/deleteCarousel',deleteCarousel);









router.post('/testCros', async function (ctx) {
    console.log('接收到了请求');
    ctx.body = {
        msg:'你登录了'
    }
});
router.post('/upload', upload.single('avatar'), async (ctx, next) => {  
    
    ctx.body = {  
      fileName: ctx.req.file.filename,                  //返回文件名 
      filePath: '/uploads/'+ctx.req.file.filename //返回文件路径
    }  
  });
router.post('/carousel', upload.single('carousel'), async (ctx, next) => {

    ctx.body = {
        fileName: ctx.req.file.filename,                  //返回文件名
        filePath: '/uploads/'+ctx.req.file.filename //返回文件路径
    }
});

module.exports=router;
