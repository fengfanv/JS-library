# CSS 基础

## CSS选择器
```css
id选择器                  #demo{}

class选择器              .demo{}

标签选择器                div{}

通配符选择器              *{}

属性选择器                [id]{}（找标签有id属性的元素）
                         [id="demo"]{}（找标签有id属性的，且id属性的值为demo的元素）

父子选择器(或叫派生选择器) div span{}
                         特点：用空格隔开

直接子元素选择器          div>span{}
                         特点：用大于号隔开

并列选择器                div.demo{}（找一个div元素，且div的class是demo的元素）
                         .demo[type="password"]{}（找一个class里有demo样式的，且该元素的type属性值是password的元素）  
                         特点：名字贴在一起，没有间隔

分组选择器                div,p,span{}  div与p与span共用某一种样式
                         特点：用逗号隔开

伪类选择器                a:hover{}
```

## CSS权重
```css
!important          Infinity(正无穷)

行间样式             1000

id                   100

class/属性/伪类       10

标签/伪元素           1

通配符                0
```

## CSS权重计算
```css
1、假设下面两个选择器样式都指向一个元素，那下面那个样式会生效？

A、#demo p{}

B、.demo .text{}

答：A

A、#demo p{}         权重：100 + 1

B、.demo .text{}     权重：10 + 10
```
```css
2、假设下面两个选择器样式都指向一个元素，那下面那个样式会生效？
A、#demo p{
    color:red;
}

B、.demo .text{
    color:green!important;
}

答：B

A、#demo p{
    color:red;
}
权重：100 + 1


B、.demo .text{
    color:green!important;
}
权重：Infinity + 10 + 10
```