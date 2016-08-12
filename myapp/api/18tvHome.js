/**
 * Created by Li on 2016/7/25.
 */
var errMessage = require('../uitls/message');
var db = require('../uitls/db');
var pool = db.pool();

//App 首页 配置数据
exports.hemo18TV = function (req, res, next) {
    var json = {};
    pool.getConnection(function (err, connection) {
        //select id, name, action from user as u left join user_action a on u.id = a.user_id
        var sql = 'SELECT b.id,c.className,b.name,b.details,b.url,b.ico,b.image FROM tab_video_recommend AS a ' +
            'LEFT JOIN tab_video_info AS b ON a.videoId = b.id ' +
            'LEFT JOIN tab_video_type AS c ON b.typeId = c.id ORDER BY a.id DESC LIMIT 10';
        var params = [];
        connection.query(sql, params, function (err, rows) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                connection.end();
                res.send(errMessage.err5005);
                return;
            }
            json.recommend = rows;
            // res.send(json);       //tab_video_type.type = 1 表示获取电视类节目
            var sql = 'SELECT  tab_video_type.id,tab_video_type.className,tab_video_type.ico FROM tab_video_type WHERE tab_video_type.type = 1';
            var params = [];
            connection.query(sql, params, function (err, rows) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    res.send(errMessage.err5005);
                    connection.end();
                    return;
                }
                json.tvLive = rows;
                // res.send(json);  //tab_video_type.type = 2 表示获取电影类节目
                var sql = 'SELECT  tab_video_type.id,tab_video_type.className,tab_video_type.ico FROM tab_video_type WHERE tab_video_type.type = 2';
                var params = [];
                connection.query(sql, params, function (err, rows) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        res.send(errMessage.err5005);
                        connection.end();
                        return;
                    }
                    json.movie = rows;
                    res.send(json);
                });
            });
            connection.release();  //释放数据库连接
        });
    });
}

//根据Id 返回对应直播流
exports.typeVideo = function (req, res, next) {

    if (req.params.typeId == null && req.params.tvTime == null && req.params.classId != null) {
        res.send(errMessage.err5002);
        return;
    }
    pool.getConnection(function (err, connection) {
        //select id, name, action from user as u left join user_action a on u.id = a.user_id
        var sql = 'SELECT * FROM tab_video_info AS a WHERE a.type = ?';
        if (req.params.classId != 0) {
            sql += " AND a.typeId = " + req.params.classId;
        }
        var sql2 = ' AND a.createTime < ?  ORDER BY a.createTime DESC LIMIT 20';
        var params = [req.params.typeId, req.params.tvTime];
        connection.query(sql + sql2, params, function (err, rows) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                connection.end();
                res.send(errMessage.err5005);
                return;
            }
            res.send(rows);
            connection.release();  //释放数据库连接
        });
    });
}

exports.tvAdvertising = function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var sql = 'SELECT * FROM tab_app_ad WHERE id = 1';
        var params = [];
        connection.query(sql, params, function (err, rows) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                connection.end();
                res.send(errMessage.err5005);
                return;
            }
            res.send(rows[0]);
            connection.release();  //释放数据库连接
        });
    });
}

exports.updataApp = function(req,res,next){
     pool.getConnection(function (err, connection) {
        var sql = 'SELECT * FROM tab_app_ad WHERE id = 2';
        var params = [];
        connection.query(sql, params, function (err, rows) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                connection.end();
                res.send(errMessage.err5005);
                return;
            }
            var row = rows[0];
            var json = {};
            json.version = row.version;
            json.details = row.details;
            json.url = row.url;
            res.send(json);
            connection.release();  //释放数据库连接
        });
    });
}