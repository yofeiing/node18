/**
 * Created by Li on 2016/7/28.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: '18TV 后台管理页面' });
});

router.get('/tvInfo', function(req, res, next) {
    res.render('admin/tvInfo', {title: 'Test'});
});

module.exports = router;