//路由模块
var express = require('express');
var user = require('./../api/user');
var tvHome = require('./../api/18tvHome');
var router = express.Router();

//用户注册模块
router.get('/user/login/:userTele/:userPwd', user.login); // 登录模块
router.post('/user/register/', user.register);            // 注册模块
router.post('/user/userPhoto/', user.userPhoto);          //用户头像
router.get('/user/token/', user.token);                   // 验证用户token是否过期

//18TV 首页数据
router.get('/18tv/',tvHome.hemo18TV);
router.get('/18tv/:typeId/:classId/:tvTime',tvHome.typeVideo);
router.get('/18tv/ad/',tvHome.tvAdvertising);

module.exports = router;