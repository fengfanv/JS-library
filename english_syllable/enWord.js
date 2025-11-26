function syllable(word) {
    /*
    原作者博客链接：https://blog.csdn.net/MAILLIBIN/article/details/79711767
    原始正则表达式：/(^y|y(?=[aeiou])|bh|ch|gh|sc|wr|ng$|[^aeiouy])?([aeiou]*y?)?([^aeiouy]*)?$/i
    */
    //----------------------------------------
    //----------------------------------------
    //上边正则表达式，分为三个捕获组。
    //----------------------------------------
    //----------------------------------------
    //第一组:音节 起始辅音簇
    let startRegExp = `(^y|y(?=[aeiou])|bh|ch|gh|ph|tr|dg|sc|wr|ng$|[^aeiouy])?`; //y(?=[aeiou])表示匹配一个y，但要求这个y后面必须紧跟着aeiou；；；结尾(...)?表示这部分是可选的
    //第二组:元音核心
    let coreRegExp = `([aeiou]*y?)?`; //[aeiou]*表示匹配0个或多个aeiou；；；y?表示y可选；；；结尾(...)?表示这部分是可选的
    //第三组:音节 结尾辅音
    let endRegExp = `([^aeiouy]*)?`; //[^aeiouy]*表示匹配0个或多个不是aeiouy的字母；；；结尾(...)?表示这部分是可选的
    //----------------------------------------
    //----------------------------------------
    //----------------------------------------
    let syllableRegExp = new RegExp(startRegExp + coreRegExp + endRegExp + '$', "i"); //$表示匹配单词末尾；；；i表示不区分大小写
    //----------------------------------------
    //----------------------------------------
    //----------------------------------------
    let letters = word;
    let syllablesArray = [];
    while (letters.length > 0) {
        const match = letters.match(syllableRegExp);

        if (match && match[0]) {
            const currentSyllable = match[0];
            syllablesArray.push(currentSyllable);

            //去除掉已匹配的单词末尾，为下一次匹配做准备
            letters = letters.substring(0, letters.length - currentSyllable.length);
        } else {
            //如果没有匹配到，跳出循环避免无限循环
            break;
        }
    }
    return syllablesArray.reverse()

    //--------------------------------------------------------------
    //正则修改日志：
    //日期        ；；；        问题/需求描述        ；；；        修改部位(起始/核心/结尾)        ；；；        修改前内容        ；；；        修改后内容
    //2025年11月26日 17点49分；；；ph是辅音组合-无法匹配ph；；；起始；；；`(^y|y(?=[aeiou])|bh|ch|gh|sc|wr|ng$|[^aeiouy])?`；；；`(^y|y(?=[aeiou])|bh|ch|gh|ph|sc|wr|ng$|[^aeiouy])?`
    //2025年11月26日 19点38分；；；tr是辅音组合-无法匹配tr；；；起始；；；`(^y|y(?=[aeiou])|bh|ch|gh|ph|sc|wr|ng$|[^aeiouy])?`；；；`(^y|y(?=[aeiou])|bh|ch|gh|ph|tr|sc|wr|ng$|[^aeiouy])?`
    //2025年11月26日 22点38分；；；dg是辅音组合-无法匹配dg；；；起始；；；`(^y|y(?=[aeiou])|bh|ch|gh|ph|tr|sc|wr|ng$|[^aeiouy])?`；；；`(^y|y(?=[aeiou])|bh|ch|gh|ph|tr|dg|sc|wr|ng$|[^aeiouy])?`
}

export { syllable };


// console.log("invitation", syllable('invitation').join('-'))
// console.log("February", syllable('February').join('-'))
// console.log("prevent", syllable('prevent').join('-'))
// console.log("computer", syllable('computer').join('-'))
// console.log("Grade", syllable('Grade').join('-'))
// console.log("direction", syllable('direction').join('-'))
// console.log("basketball", syllable('basketball').join('-'))
// console.log("international", syllable('international').join('-'))
// console.log("teacher", syllable('teacher').join('-'))
// console.log("beautiful", syllable('beautiful').join('-'))
// console.log("international", syllable('international').join('-'))
// //---
// console.log("elephant", syllable('elephant').join('-'))
// console.log("rephrase", syllable('rephrase').join('-'))
// console.log("physiology", syllable('physiology').join('-'))
// console.log("phone", syllable('phone').join('-'))
// console.log("atmospheric", syllable('atmospheric').join('-'))
// //---
// console.log("introduce", syllable('introduce').join('-'))
// console.log("traditional", syllable('traditional').join('-'))
// console.log("electronic", syllable('electronic').join('-'))
