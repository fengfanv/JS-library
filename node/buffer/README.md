# node 里 Buffer 与 字节(B/Byte) 的关系

Buffer 的结构和数组很像，操作的方法也和数组类似，数组中不能存储二进制文件，而 Buffer 就是专门用来存储二进制数据的

Buffer 中存储的是二进制数据，但是在显示时，是以16进制的形式显示的（因为二进制显示的太长了，不方便显示，所以用16进制的形式来显示）

Buffer 中每个元素的范围是从 (16进制 ( 00-ff )) (即10进制 ( 0-255 )) (即2进制 ( 00000000-11111111 ))

Buffer 中每个元素占用一个字节(1B/1Byte/8bit)

Buffer.length 输出的是占用内存的大小。表明当前Buffer数据，或当前二进制数据，占用多大内存。或当前Buffer数据，有多少个字节。

Buffer 是用于处理(或存储)二进制数据的，其的形式可以理解成一个数组，数组中的每一项(每个元素)都可以保存一个 8位的二进制数据(00000000)，也就是1个字节。保存的8位二进制00000000-11111111。

二进制0b开头，十六进制0x开头

1(B/Byte/字节) === 8(bit/比特/位)

|                           | ASCII | Unicode编码 | UTF-8编码 |
|             ----              | ----      | ----    | ----    |
| 一个英文字符(含英文符号)          | 一个字节 | 两个字节 | 一个字节 |
| 一个中文字符(含中文符号 和 繁体字) | 两个字节 | 两个字节 | 三个字节 |

1KiB（Kibibyte）=== 1024Byte

1KB（Kilobyte）=== 1000Byte

1MiB（Mebibyte）=== 1048576Byte

1MB（Megabyte）=== 1000000Byte

### 使用Buffer
```javascript
// 创建Buffer
// 1、使用字符串创建Buffer
var buff = Buffer.from('hello');
console.log(buff);//<Buffer 68 65 6c 6c 6f>     以16进制的形式显示二进制数据
console.log(buff.length);//5    查看buff长度，查看buff有多少个元素，或查看buff使用了多少字节的内存空间

var buff2 = Buffer.from('你好');
console.log(buff2);//<Buffer e4 bd a0 e5 a5 bd>
console.log(buff2.length);//6

// 2、使用Buffer.alloc()创建Buffer
var buff = Buffer.alloc(5);//创建一个 5个字节大小的buffer
console.log(buff);//<Buffer 00 00 00 00 00>     默认是0x00 0x00 0x00 0x00 0x00
console.log(buff.length);//5


// 与数组类似，可直接通过索引操作Buffer元素
buff[0] = 255;
buff[1] = 0xff;
console.log(buff);//<Buffer ff ff 00 00 00>

//只要数字在控制台或页面中输出一定是10进制
//如果想要以16进制输出可以将它转换成16进制的字符串输出
console.log(buff[0]);//255      默认以10进制输出
console.log(buff[1]);//255      默认以10进制输出

console.log(buff[0].toString(16));//ff      转换成16进制字符串输出
console.log(buff[1].toString(16));//ff      转换成16进制字符串输出

console.log(buff[0].toString(2));//11111111 转换成2进制字符串输出

buff[0] = 0x68;//英文字母 h
buff[1] = 0x65;//英文字母 e
console.log(buff.toString());//he
console.log(buff.toString('utf-8'));//he
```

#### 参考链接：
[node内置模块——Buffer模块（缓冲区）](https://blog.csdn.net/mantou_riji/article/details/125012170)

[node里面的buffer理解](https://www.cnblogs.com/wuxianqiang/p/10328296.html)

[bit、byte、KB、B、字节、位、字符之间关系详解](https://blog.csdn.net/qq_41675254/article/details/86481615)




