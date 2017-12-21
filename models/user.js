var mongoose = require('../config/config');

//blog唯一用户登录
//用schema创建数据库模型骨架
var personSchema = new mongoose.Schema({
    phone:{type:String,default:''},
    password:{type:String,default:''}
});

module.exports = mongoose.model('users',personSchema);