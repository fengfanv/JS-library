import network

import urequests
# urequests是第三方包，需要额外安装
'''
安装步骤：
连接esp32设备后。在thonny下方的shell命令框内输入如下命令：
1、import upip
2、upip.install('micropython-xxx')    # xxx是要安装的第三方包名。如，这里安装urequests就是，upip.install('micropython-urequests')
安装好后，esp32的文件目录里，会出现一个名为lib的文件夹，而刚刚安装的第三方包就被放在lib文件夹里
如何删除刚刚安装的第三方包？请手动将lib文件夹内的第三方包删除
'''

'''
如果 import upip 不好用，请使用如下方法来安装第三方库：

import mip
mip.install("pkgname") # 安装的模块文件是 xxx.mpy （模块压缩后的版本，体积小，不方便阅读源码）
mip.install("pkgname", mpy=False) # 安装的模块文件是 xxx.py（模块源版本，未压缩版本，体积大，但方便阅读源码）
'''

# 连接wifi
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
if not wlan.isconnected():
    print('connecting to network...')
    wlan.connect('Xiaomi_FB76', 'xxx')

    while not wlan.isconnected():
        pass
print('网络配置:', wlan.ifconfig())


# 发起一个get请求
'''
url = "http://192.168.31.95/api/getData?a=1&b=2"
try:
    response = urequests.get(url)
    if response.status_code == 200:
        print(response.text) # 打印响应内容
    else:
        print('Error: ', response.status_code)
        print(response.text) # 打印原始响应内容以进行调试
finally:
    response.close() # 确保关闭响应
'''


# 发起一个post请求
'''
url = 'http://192.168.31.95/api/postData'
data = '{"key":"value"}' # json字符串
headers = {'Content-Type': 'application/json'}

try:
    response = urequests.post(url, data=data, headers=headers)
    
    # 检查状态码
    if response.status_code == 200:
        print(response.text) # 打印响应内容
    else:
        print('Error: ', response.status_code)
        print(response.text) # 打印原始响应内容以进行调试
finally:
    response.close() # 确保关闭响应
'''
