# 清楚浮动
```css
.clearfix:after,.clearfix:before{content: "";display: table;}
.clearfix:after{clear: both;}
.clearfix{*zoom:1;}
```
#### 使用案例
```html
<div class="clearfix">
	<p style="float:left"></p>
	<p style="float:left"></p>
	<p style="float:left"></p>
	<p style="float:left"></p>
</div>
```