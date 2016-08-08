var express = require('express');
var db = require('./db');
var errMessage = require('./message');
var pool =db.pool();

 //将来要做权限验证
exports.tokenUitil=function(req, res, next){

	var url = req.originalUrl;

    // console.log(url);  //准备拦截路由做准备

    if (url=="/" ||url == "/user/register" || url.indexOf("/user/login/") >= 0 || url.indexOf("/294076a417c7f1c0991ef8220579a7e4.txt")>=0
        || url.indexOf("/photo_userId")>=0 ||url.indexOf("/photo_house_")>=0 || url.indexOf("/user/token/")>=0) {
        next();
        return;
    }

    if(req.headers.token==null){
        res.send(errMessage.err5004);
        return;
    }

    authorization(req.headers.token,function(obj){
        if(obj=="err"){
            res.send(errMessage.err5001);
            return;
        }
        if(obj=="notfind"){
            res.send(errMessage.err5004);
            return;
        }
        req.headers.userId=obj[0].userId;
        next();
    });

// console.log(req.headers.token);
//      req.headers.userId="123";      //权限通过 setUserId
 //   	权限没问题进行放行 让相应路由进行处理
   

}

//  重定向 res.redirect("/login");
function authorization(token,callbak){
    pool.getConnection(function(err, connection) {
        var  sql = 'SELECT * FROM tab_user_token WHERE tokenCode = ?';
        var  params =[token];
        connection.query(sql,params, function(err, rows) {
          if(err){
            callbak("err");
            connection.end();
            return;
          }
          if(rows.length>0){
            callbak(rows);
          }else{
            callbak("notfind");
          }         
          connection.release();  //释放数据库连接
        });
  });
}