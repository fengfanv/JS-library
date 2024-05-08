import ubinascii

# python字节序列类型。python字节序列类型和Node的Buffer一样，都是用于处理二进制数据的工具。通常用于文件I/O、网络通信等

# base64编码

text = 'hello world'

textBy = text.encode('utf-8')  # 将字符串转成<字节序列类型>数据  b'hello world'

print(type(textBy))  # <class 'bytes'>    <字节序列类型>数据

# b2a_base64方法入参需要是一个<字节序列类型>数据。注意b2a_base64方法的结果也是<字节序列类型>数据
base64By = ubinascii.b2a_base64(textBy)

print(base64By)  # b'aGVsbG8gd29ybGQ=\n'

base64Str = base64By.decode('utf-8')  # 把编码后是base64的<字节序列类型>数据 转成 字符串

print(base64Str)  # aGVsbG8gd29ybGQ=

# base64解码

# 注意这里解码后的结果是<字节序列类型>数据    b'hello world'
result = ubinascii.a2b_base64(base64Str)

print(result.decode('utf-8'))  # 把<字节序列类型>数据 转成 字符串    hello world
