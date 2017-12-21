var mongoose = require('../config/config');

//blog文本数据表
//用schema创建数据库模型骨架
var blogSchema = new mongoose.Schema({
    blogName:{type:String,default:''},
    blogLabel:{type:String,default:''},
    blogText:{type:String,default:''},
    blogTime:{type: Date, default:Date.now}
});

module.exports = mongoose.model('blogs',blogSchema);