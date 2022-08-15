const fs = require('fs');
const path = require('path');

const project_path = "E:/\/爱赡养项目/\/member-uniapp/\/"; //项目目录，绝对地址

//忽略的文件或文件夹
const ignore = ['unpackage', 'app.vue'];

//项目里的所有.vue格式的文件目录
const vue_files = [];

//项目里的所有.css格式的文件目录
const css_files = [];

//读取文件目录
function readdir(_path) {
    return new Promise((resolve, reject) => {
        fs.readdir(_path, (err, files) => {
            if (err) {
                reject(err)
            }
            resolve(files || []);
        })
    })
}

//检查是否是被忽略的文件或目录
function isIgnore(_path) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < ignore.length; i++) {
            let re = new RegExp(ignore[i]);
            if (re.test(_path)) {
                resolve(true);
            }
        }
        resolve(false);
    })
}



//检查文件是不是某个格式的文件
function file_format_in(_path, format) {
    return new Promise((resolve, reject) => {
        const stat = fs.statSync(_path);
        if (stat.isFile()) {
            let { ext } = path.parse(_path);
            ext = ext.replace(/^(.)/, "");
            if (ext == format) {
                resolve(true);
            } else {
                resolve(false);
            }
        } else {
            resolve(false);
        }
    })

}

//开始，找项目里所有.vue文件 和 .css文件
function find_file(_path) {
    const stat = fs.statSync(_path);
    if (stat.isFile()) {
        //是文件

        //检查文件是不是vue格式的文件
        file_format_in(_path, 'vue').then((res) => {
            if (res) {
                vue_files.push(_path);
            }
        })

        //检查文件是不是css格式的文件
        file_format_in(_path, 'css').then((res) => {
            if (res) {
                css_files.push(_path);
            }
        })

    } else if (stat.isDirectory()) {
        //是文件夹
        isIgnore(_path).then((re) => {
            if (re != true) {
                readdir(_path).then((res) => {
                    if (res.length) {
                        for (let i = 0; i < res.length; i++) {
                            find_file(path.join(_path, res[i]));
                        }
                    }
                })
            }
        })

    }
}


//获取 .vue文件里 html和css
function readVueFile(_path) {
    return new Promise((resolve, reject) => {
        fs.readFile(_path, 'utf8', function(err, data) {
            if (err) {
                reject(err);
            }
            // console.log("读取成功！");
            //console.log(data);

            let vue_file_data = data;

            let htmlText = "";

            let cssText = "";

            //  正则里   .   只匹配单个字符，除了换行和行结束符，因为html是格式化后的，所以要在.后面要加上  |\s|\S|\n|\f|\r|\t|\v   来匹配换行符等其它特殊符号

            let html_reg_exp = new RegExp("<template.*?>(.|\s|\S|\n|\f|\r|\t|\v)*?</template>", 'g');
            let html_reg_result = html_reg_exp.exec(vue_file_data);
            if (html_reg_result && html_reg_result) {
                htmlText = html_reg_result[0];
                //去除template标签
                htmlText = htmlText.replace(new RegExp("<(/)*?template(.|\s|\S|\n|\f|\r|\t|\v)*?>", 'g'), "");
                // console.log("htmlText", htmlText);
            }

            let css_reg_exp = new RegExp("<style.*?>(.|\s|\S|\n|\f|\r|\t|\v)*?</style>", 'g');
            let css_reg_result = css_reg_exp.exec(vue_file_data);
            if (css_reg_result && css_reg_result[0]) {
                cssText = css_reg_result[0];
                //去除style标签
                cssText = cssText.replace(new RegExp("<(/)*?style(.|\s|\S|\n|\f|\r|\t|\v)*?>", 'g'), "");
                // console.log("cssText", cssText);
            }
            resolve({
                htmlText,
                cssText
            })
        });
    })
}

//获取 .css文件内 css文本
function readCssFile(_path) {
    return new Promise((resolve, reject) => {
        fs.readFile(_path, 'utf8', function(err, data) {

            if (err) {
                reject(err);
            }
            // console.log("读取成功！");
            // console.log(data);
            resolve({
                cssText: data
            })
        });
    })
}

//写一个html文件
function writeHtmlFile(fileName, htmlText, cssText, publicCss) {
    return new Promise((resolve, reject) => {
        let publicCssTemplate = ``;
        for (let i = 0; i < publicCss.length; i++) {
            publicCssTemplate += `<link rel="stylesheet" href="../css/public_${i}.css">`
        }

        let htmlTemplate = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                    ${publicCssTemplate}
                    <link rel="stylesheet" href="../css/font.css"><!--字体css配置文件，别删-->
                    <style>
                    ${cssText}
                    </style>
                </head>
                <body>
                    ${htmlText}
                </body>
            </html>`;

        fileName = fileName.replaceAll("\\", "_").replaceAll(":", "_").replace(/(.)vue$/, "");

        let save_path = path.join(__dirname, 'demo', 'html', fileName + '.html')

        fs.writeFile(save_path, htmlTemplate, function(err) {
            if (err) {
                reject(err);
            }
            resolve(save_path);
        });
    })
}

//写一个css文件
function writeCssFile(cssText, i) {
    return new Promise((resolve, reject) => {
        let save_path = path.join(__dirname, 'demo', 'css', 'public_' + i + '.css')
        fs.writeFile(save_path, cssText, function(err) {
            if (err) {
                console.log("报错，写入文件：", save_path);
            }
            console.log("写入成功css", save_path);
        });
    });
}

//项目里公共css数据列表
var cssPublicDataArr = [];

//读取文件列表
find_file(project_path);
setTimeout(() => {
    console.log("vue_files", vue_files);
    console.log("css_files", css_files);
    //先读取css文件列表
    for (let i = 0; i < css_files.length; i++) {
        readCssFile(css_files[i]).then((res) => {
            return writeCssFile(res.cssText, i); //读完就写
        })
    }

    //在读取vue文件
    for (let i = 0; i < vue_files.length; i++) {
        readVueFile(vue_files[i]).then((res) => {
            console.log("读取成功vue", vue_files[i]);
            return writeHtmlFile(vue_files[i], res.htmlText, res.cssText, css_files);
        }).then((res) => {
            console.log('写入成功html', res);
        }).catch((err) => {
            console.log('写入失败html', err);
        })
    }
}, 3000)

//readVueFile('E:\\爱赡养项目\\member-uniapp\\pages\\aboutUs\\aboutUs.vue');

//readCssFile('E:\\爱赡养项目\\member-uniapp\\static\\css\\common.css');