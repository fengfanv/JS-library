var mysql = require('mysql');
// 创建 mysql 连接池资源
var pool = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
	port: '3306',
    database : 'map'
});

exports.query = function(sql, arr, callback){
    // 建立链接
    pool.getConnection(function(err,connection){
        if(err){throw err;return;}
        connection.query(sql,arr,function(error,results,fields){
			// Results代表是查询的结果，如果是插入修改等操作，则返回影响数据库信息的对象
			// fields代表查询的字段信息
			
            // 将链接返回到连接池中
            connection.release();
            if(error) throw error;
            // 执行回调
            callback && callback(error,results,fields);
        });
    });
};

//使用案例
/*
var sql = 'SELECT * FROM user where account = ?;
var account = 'xiaowang'
mysql.query(sql,account,function(err, result){
	if(err){
		console.log('[SELECT ERROR] - ',err.message);
		return;
	}
    //console.log(result);
});
*/