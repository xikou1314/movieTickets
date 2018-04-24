import Router from 'koa-router';

import hotFilm from '../controllers/web/hotFilm';
import filmDetail from '../controllers/web/filmDetail';
import newUser from '../controllers/web/newUser';
import checkUser from '../controllers/web/checkUser';
import login from '../controllers/web/login';
import searchArrange from '../controllers/web/searchArrange';
import roomInfo from '../controllers/web/roomInfo';
import seatInfo from '../controllers/web/seatInfo';
import pay from '../controllers/web/pay';
import userInfo from '../controllers/web/userInfo';
import updateUser from '../controllers/web/updateUser';
import bookingList from '../controllers/web/bookingList';
import updatePwd from '../controllers/web/updatePwd';
import selectedSeat from '../controllers/web/selectedSeat';
import films from '../controllers/web/films';
import searchFilm from '../controllers/web/searchFilm';
import getCaptha from '../controllers/web/getCaptcha';
import webCharge from '../controllers/web/webCharge';
import phoneCharge from '../controllers/web/phoneCharge';
import getCarousel from '../controllers/web/getCarousel';

const router = new Router();

const multer = require('koa-multer');//加载koa-multer模块  
//文件上传  
//配置  
var storage = multer.diskStorage({  
  //文件保存路径  
  destination: function (req, file, cb) {  
    cb(null, 'public/avatar')  
  },  
  //修改文件名称  
  filename: function (req, file, cb) {  
    var fileFormat = (file.originalname).split(".");  
    cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);  
  }  
})  
//加载配置  
var upload = multer({ storage: storage });  
router.prefix('/web');


router.get('/hotFilm',hotFilm);
router.get('/filmDetail',filmDetail);
router.post('/newUser',newUser);
router.get('/checkUser',checkUser);
router.get('/searchArrange',searchArrange);
router.get('/roomInfo',roomInfo);
router.get('/seatInfo',seatInfo);
router.post('/login',login);
router.post('/pay',pay);
router.get('/userInfo',userInfo);
router.post('/updateUser',updateUser);
router.get('/bookingList',bookingList);
router.get('/selectedSeat',selectedSeat);
router.post('/updatePwd',updatePwd);
router.post('/webCharge',webCharge);
router.post('/phoneCharge',phoneCharge);
router.get('/films',films);
router.get('/searchFilm',searchFilm);
router.get('/getCaptcha',getCaptha);
router.get('/getCarousel',getCarousel);



















































router.post('/up hy6666loadAvatar', upload.single('files'), async (ctx, next) => {
  ctx.body = {  
    code:0,
    fileName: ctx.req.file.filename,                  //返回文件名 
    filePath: '/avatar/'+ctx.req.file.filename //返回文件路径
  }  
});  
module.exports=router;
