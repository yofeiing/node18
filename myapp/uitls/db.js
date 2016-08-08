var express = require('express');
var mysql  = require('mysql');
//创建数据库连接
var connection = mysql.createConnection({
    host     : '120.27.33.15',
    user     : 'root',
    password : 'view0330',
    port: '3306',
    database: '18TV',
});
//创建数据库连接池 默认为十个连接
var poolcoon = mysql.createPool({
    connectionLimit : 100,
    host     : '120.27.33.15',
    user     : 'root',
    password : 'view0330',
    port: '3306',
    database: '18TV',
});
//开始连接数据库
connection.connect(function(err){
    if(err){
        console.log('[query] - :'+err);
        return;
    }
    console.log('[connection connect]  succeed!');
    });
//定义返回数据方法
function conn(){
    return connection;
}
//定义返回数据池方法
function pool(){
    return poolcoon;
}

exports.conn=conn;
exports.pool=pool;