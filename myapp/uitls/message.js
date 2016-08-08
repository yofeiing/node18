var express = require('express');

var errMessage = {
    err5002: {
        "5002": "传值错误"
    },
    err5007: {
        "5007": "用户名密码错误"
    },
    err5001: {
        "5001": "网络故障请稍后重试"
    },
    err5003: {
        "5003": "手机号码已被注册"
    },
    err5004: {
        "5004": "token无效"
    }
    , err5005: {
        "5005": "服务器内部错误"
    },
    success: {
        "200": "success"
    }
}

module.exports = errMessage;