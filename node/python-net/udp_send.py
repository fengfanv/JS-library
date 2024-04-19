import socket

# udp给指定电脑发送消息案例

# 创建upd 套接字（socket.AF_INET代表ipv4，socket.SOCK_DGRAM代表使用upd协议）
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# 准备 接收方 的地址
to_addr = ('192.168.31.95', 5678)  # 注意，这里是元组类型，ip是字符串，端口号是数字

# 从键盘获取，要发送的内容
send_data = input('请输入要发送的内容：')

# 发送数据到指定电脑(ip)上的指定程序(port)中
s.sendto(send_data.encode('utf-8'), to_addr) # str.encode()对字符串进行编码；str.decode()对字符串进行解码

# 发送完消息，关闭socket
s.close()
