# 字蛛处理字体

## 此文章内容来源于以下文章（感谢原作者的编写）：

1、[（字蛛工具使用）https://www.jianshu.com/p/8ef246692d14](https://www.jianshu.com/p/8ef246692d14)

2、[（字蛛工具官方GitHub）https://github.com/aui/font-spider/](https://github.com/aui/font-spider/)

3、[（字体包转格式网站）https://transfonter.org](https://transfonter.org)

4、[（百度字体包处理网站）http://font.qqe2.com](http://font.qqe2.com)

## 1、字蛛工具的安装与使用

_安装_
```
npm install font-spider -g      //需要全局安装。局部安装后，使用时会有问题
```

_字体css文件_
```css
/*字体配置文件，别删*/

@font-face {
    font-family: PingFang SC-Bold;
    src: url('../font/PINGFANG BOLD.TTF') format('truetype');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: PingFang SC-ExtraLight;
    src: url('../font/PINGFANG EXTRALIGHT.TTF') format('truetype');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: PingFang SC-Heavy;
    src: url('../font/PINGFANG HEAVY.TTF') format('truetype');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: PingFang SC-Light;
    src: url('../font/PINGFANG LIGHT.TTF') format('truetype');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: PingFang SC-Medium;
    src: url('../font/PINGFANG MEDIUM.TTF') format('truetype');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: PingFang SC-Regular;
    src: url('../font/PINGFANG REGULAR.TTF') format('truetype');
    font-weight: normal;
    font-style: normal;
}
```

_使用字体包的html_
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>字体问题</title>
    <link rel="stylesheet" href="../css/font.css">

    <style>
        .Bold {
            font-family: PingFang SC-Bold;
        }
        
        .ExtraLight {
            font-family: PingFang SC-ExtraLight;
        }
        
        .Heavy {
            font-family: PingFang SC-Heavy;
        }
        
        .Light {
            font-family: PingFang SC-Light;
        }
        
        .Medium {
            font-family: PingFang SC-Medium;
        }
        
        .Regular {
            font-family: PingFang SC-Regular;
        }
    </style>
</head>

<body>
    <p class="Bold">这是一段实验字体包的文字 PingFang SC-Bold（粗体）</p>
    <p class="ExtraLight">这是一段实验字体包的文字 PingFang SC-ExtraLight（特细）</p>
    <p class="Heavy">这是一段实验字体包的文字 PingFang SC-Heavy（特粗）</p>
    <p class="Light">这是一段实验字体包的文字 PingFang SC-Light（细体）</p>
    <p class="Medium">这是一段实验字体包的文字 PingFang SC-Medium（中等）</p>
    <p class="Regular">这是一段实验字体包的文字 PingFang SC-Regular（常规）</p>
</body>

</html>
```

_使用字蛛工具压缩字体包_

常用命令1

```
font-spider ./demo/demo.html   //处理某一个文件
```

常用命令2

```
font-spider ./demo/*.html   //这里可以使用通配符*来匹配，某个文件夹下所有的html文件
```

常用命令3

```
font-spider ./demo/*.html ./demo/pages/index.html    //可以同时压缩不同文件夹内的html文件，文件夹之间插入空格
```

常用命令4  debug模式

```
//在命令的后面加上--debug，进入debug模式
如：font-spider ./demo/*.html --debug
```

## 2、其它内容及命令

此项目基本结构

```
├── demo
│   ├── css
│   │   ├── font.css       字体配置文件（别删）
│   │   ├── public_0.css   demo公共样式
│   │
│   ├── font               字体包文件夹
│   │
│   ├── html
│   │   ├── demo.html      演示字体包html（别删）
│
├── node-modules
├── index.js               将vue文件编译成html的node程序
├── package.json
├── README.md
```

将vue文件编译成html的node程序

```
//1、在此demo的index.js内，配置project_path（vue项目文件地址）
//2、配置好后，运行node index.js
//3、node代码将会把vue项目内所有vue文件，处理成html，然后再放入，此demo的html文件夹内
//4、处理好后，运行字蛛工具命令，压缩字体包文件
```





