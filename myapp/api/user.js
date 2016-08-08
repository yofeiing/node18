//用户模块
// var express = require('express');
var uuid = require('node-uuid');
//数据库连接模块
var db = require('../uitls/db');
var fs = require('fs');
var errMessage = require('../uitls/message');
var pool = db.pool();

//登录模块
exports.login = function (req, res, next) {

    if(req.params.userTele==null && req.params.userPwd==null){
      res.send(errMessage.err5002);
      return;
    }

    pool.getConnection(function (err, connection) {
        var sql = 'SELECT * FROM tab_user WHERE userTele = ? and userPwd = ?';
        var params = [req.params.userTele, req.params.userPwd];
        connection.query(sql, params, function (err, rows) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                connection.end();
                return;
            }
            var json = {
                token: uuid.v1()
            }
            if (rows.length > 0) {
                json.userId = rows[0].id;
                json.userName = rows[0].userName;
                json.userSex = rows[0].userSex;
                json.userWechat = rows[0].userWechat;
                json.userAddress = rows[0].userAddress;
                json.userJob = rows[0].userJob;
                json.userPhoto = rows[0].userPhoto;
                json.userIdentityCard = rows[0].userIdentityCard;
            } else {
                res.send(errMessage.err5007);
                return;
            }

            var sql = 'INSERT INTO tab_user_token (userId,tokenCode,createTime) VALUES(?,?,?)';
            var params = [json.userId, json.token, Date.now()];
            connection.query(sql, params, function (err, rows) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    res.send(errMessage.err5001);
                    connection.end();
                    return;
                }
                res.send(json);
            });
            connection.release();  //释放数据库连接
        });
    });
};


//注册模块
exports.register = function (req, res, next) {

    // console.log(req.headers.userId);
    if (req.body.userTele == null || req.body.userPwd == null || req.body.teleCode == null || req.body.userName == null) {
        res.send(errMessage.err5002);
        return;
    }
    //验证短信验证码
    isTeleCode(req.body.teleCode, res, function () {
        //效验用户是否存在
        pool.getConnection(function (err, connection) {
            var sql = 'SELECT userTele FROM tab_user WHERE userTele = ?';
            var params = [req.body.userTele];
            connection.query(sql, params, function (err, rows) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    res.send(errMessage.err5001);
                    connection.end();
                    return;
                }
                if (rows.length > 0) {
                    res.send(errMessage.err5003);
                    return;
                } else {
                    //把用户注册信息存入user表
                    pool.getConnection(function (err, connection) {
                        var sql = 'INSERT INTO tab_user (userTele,userPwd,userName,userCreateTime) VALUES(?,?,?,?)';
                        var params = [req.body.userTele, req.body.userPwd, req.body.userName, Date.now()];
                        connection.query(sql, params, function (err, rows) {
                            if (err) {
                                console.log('[SELECT ERROR] - ', err.message);
                                res.send(errMessage.err5001);
                                connection.end();
                                return;
                            }
                            res.send(errMessage.success);
                            connection.release();  //释放数据库连接
                        });
                    });
                }
            });
        });
    });
};

//修改用户头像模块
exports.userPhoto = function (req, res, next) {

    var userId = req.headers.userId;
    if (req.body.image == null) {
        res.send(errMessage.err5002);
        return;
    }
    var imgData = req.body.image;
    savePhoto(imgData, function (path) {
        res.send(path);
    });

};

//用户头像保存回掉方法
function savePhoto(imgData, callbak) {
    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    var userPhotoPath = 'photo_userId_' + userId + '.png';
    fs.writeFile("../Boss_userPhoto/" + userPhotoPath, dataBuffer, function (err) {
        if (err) {
            res.send(err.message);
        } else {
            pool.getConnection(function (err, connection) {
                var sql = 'UPDATE tab_user SET userPhoto=? WHERE id = ?';
                var params = [userPhotoPath, userId];
                connection.query(sql, params, function (err, rows) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        res.send(errMessage.err5001);
                        connection.end();
                        return;
                    }
                    callbak(userPhotoPath);
                    connection.release();
                });
            });
        }
    });
}

//验证Token 是否过期
exports.token = function (req, res, next) {

    if (req.headers.token == null) {
        res.send(errMessage.err5004);
        return;
    }
    pool.getConnection(function (err, connection) {
        var sql = 'SELECT * FROM tab_user_token WHERE tokenCode = ?';
        var params = [req.headers.token];
        connection.query(sql, params, function (err, rows) {
            if (err) {
                res.send(errMessage.err5001);
                connection.end();
                return;
            }
            if (rows.length > 0) {
                res.send(errMessage.success);
            } else {
                res.send(errMessage.err5004);
            }
            connection.release();  //释放数据库连接
        });
    });
};

//短信验证码
function isTeleCode(teleCode, res, callbak) {
    if (teleCode != null) {   //将来进行验证码判断
        callbak();
    }
}