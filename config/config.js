var mongoose = require('mongoose');
var DB_URL='mongodb://myblog:myblog@127.0.0.1:27017/myblog';
//通过schema创建model
mongoose.connect(DB_URL, {
    useMongoClient: true
    /* other options */
});//连接数据库
/**
 * 连接成功
 */
mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to ' + DB_URL);
});

/**
 * 连接异常
 */
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

module.exports = mongoose;