# MySQL

[文件地址](https://github.com/fengfanv/JS-library/tree/master/mysql)

### Node.js 封装模块
```javascript
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
        if(err){throw err;}
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

```

### 基本命令
> windows启动服务
```
net start mysql
```
> windows关闭服务
```
net stop mysql
```
> 命令行登入mysql
```
mysql -u用户名 -p
```
> 显示所有数据库
```
show databases;
```
> 打开数据库
```
use 数据库名;
```
> 创建数据库
```
create database 数据库名;
```
> 删除数据库
```
drop database 数据库名;
```
> 显示打开的数据库里所有表
```
show tables;
```
> 显示表结构
```
show columns from 数据表名;
```
> 显示表索引信息
```
show index from 数据表名;
```
> 退出数据库
```
quit;
```
> 创建数据表
```
create table `表名`(
	`字段名` 类型[(长度)] not null auto_increment,
	`字段名` varchar(30) not null,
	primary key (`id`)
)charset=utf8;
## auto_increment ==> 自增主键
```
> 数据表插入数据
```
insert into 表名 (字段名1,字段名2, 字段名...) values (字段名1的值,字段名2的值, 字段名...的值);
```
> 更新数据表数据1
```
update 表名 set 字段名='要变得值'[,字段名='要变得值'] where 条件;
```
> 更新数据表数据2，对原数据进行累加
```
update 表名 set 字段名=字段名+1 where 条件;
```
> 删除数据表里数据
```
delete from 表名 where 表达式;
```
> 导出数据库里所有表
```
mysqldump -u用户名 -p 数据库名 > 存储地址和存储文件名称

举个栗子：
mysqldump -uroot -p123456 map > D:\map.sql
```
> 导入数据
```
1、没有创建库，先创建数据库create database 数据库名;
2、打开数据库use database 数据库名;
3、source 数据库文件地址;
```

---

### 修改表结构
> 重命名表名
```
ALTER TABLE 旧表名 rename 新表名;
```
> 添加新字段（列）
```
ALTER TABLE 表名 ADD COLUMN 新增字段名 字段类型(长度);
```
> 修改字段类型
```
ALTER TABLE 表名 MODIFY 字段名 字段类型(长度);
```
> 修改字段为非空
```
ALTER TABLE 表名 MODIFY 字段名 字段类型(长度) not null;
```
> 设置字段默认值
```
ALTER TABLE 表名 ALTER 字段名 SET DEFAULT "内容";
```
> 删除字段默认值
```
ALTER TABLE 表名 ALTER 字段名 DROP DEFAULT;
```
> 删除表字段
```
ALTER TABLE 表名 DROP COLUMN 字段名;
```
> 修改表字段名
```
ALTER TABLE 表名 RENAME COLUMN 旧字段名 TO 新字段名;
```
> 删除表
```
DROP TABLE 表名;
```
> 自增id恢复到从0开始（前提，数据已清空）
```
ALTER TABLE 表名 AUTO_INCREMENT=1；
```
### 查询
> 简单查询
```
select [DISTINCT] [*,字段名或表达式 [AS 显示的名字]] from 表名;

## DISTINCT 可选，指查询结果中，相同查询结果只显示一条

如:select 姓名,班级,语文成绩+数学成绩+英语成绩 AS 总分 from 成绩单
如:select DISTINCT 专业 from 学籍;  结果为：某某专业，某某专业
```
> 使用标准函数查询数据
```
COUNT([DISTINCT]<表达式>) 统计表中记录的个数，如果选择DISTINCT统计记录时表达式值相同的记录，只统计一条

SUM([DISTINCT]<表达式>) 计算数值表达式的和，如果选择DISTINCT计算函数值时，数值表达式值相同的记录只有一条参加求和运算

AVG([DISTINCT]<表达式>) 计算数值表达式的平均值，如果选择DISTINCT数值表达式值相同的记录只有一条参加平均值运算

MIN(<表达式>) 计算表达式的最小值。表达式可以使数值型，字符型，逻辑型或日期型数据

MAX(<表达式>) 计算表达式的最大值

如：select COUNT(*),MAX(数学成绩),MAX(语文成绩+数学成绩+英语成绩) AS 总分 from 成绩表
```
> 条件查询
```
*可使用使用的运算符:
*关系运算符:=、<>、>、>=、<、<=
*逻辑运算符：NOT，AND，OR

如:查询入学成绩大于400且小于450的记录
select * from 成绩 where 入学成绩>=400 AND 入学成绩<=450

如:查询以上的数据还可以用BETWEEN（指定区间）
select * from 成绩 where 入学成绩 BETWEEN 400 AND 450

*格式匹配LIKE（LIKE通配符：%代表多个字符，_代表一个字符）

如:查询王姓记录
select * from 学籍 where 姓名 LIKE "王%"

*利用where连表查询
select 学籍表.姓名,学籍表.家长电话,MIN(成绩表.总分) from 学籍表,成绩表 where 学籍表.学号=成绩表.学号

```
> 查询排序
```
*升序ASC，小的在上，降序DESC，大的在上

如:查询学生姓名，专业按出生日期字段降序输出
select 姓名,专业,出生日期 from 学籍表 ORDER BY 出生日期 DESC

如:利用出生日期字段计算年龄,并按计算出年龄降序输出
select 姓名,year(date())-year(出生日期) AS 年龄 from 学籍 ORDER BY 年龄 DESC
```
> 查询分组
```
如：查询学籍表中2011级每个专业学生数学最高成绩的同学（提示：学号字段前两位为11）
select "20"+LEFT(学号,2) AS 入学年,专业,MAX(数学成绩) from 学籍表 GROUP BY 专业 where LEFT(学号,2)="11";

查询结果：
2011,A专业,999
2011,B专业,1234

*HAVING <条件>在分组结果中，对满足条件的组在在进行操作，只能在GROUP BY后使用不能单独使用

如:查询学籍表中入学年为2011级的平均入学成绩
select "20"+LEFT(学号,2) AS 入学年, AVG(入学成绩) from 学籍表 GROUP BY 入学年 HAVING 入学年="2011"

如:当然，上面的也可以用where的方式查询出来
select "20"+LEFT(学号,2) AS 入学年, AVG(入学成绩) from 学籍表 where 入学年="2011"
```
### 修改mysql密码
```
修改mysql密码（适用版本：5.7.11）：1、use mysql; //打开mysql库2、update user set authentication_string=password('123456') where user='root' and host='localhost'; //修改密码3、flush privileges; //刷新权限注意：如果按照上面的操作执行完之后密码没有变化，请尝试把host='localhost'中 'localhost' 改成 '%'
```
