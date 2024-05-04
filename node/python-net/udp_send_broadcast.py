import socket

# udp发送广播消息案例

# 创建upd 套接字（socket.AF_INET代表ipv4，socket.SOCK_DGRAM代表使用upd协议）
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# 设置此upd 套接字允许其广播(注意如果udp 套接字需要广播，则一定要添加此语句)
# setsockopt()是用于设置套接字选项的方法。socket.SOL_SOCKET是套接字选项的级别，表示当前设置的是通用套接字选项。socket.SO_BROADCAST是要设置的选项名称，表示允许套接字发送广播消息。1是选项的值，表示启用广播功能。
s.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)

# 向本局域网中发送广播数据
# 此时只要是本局域网中的电脑上有 用5678端口的udp程序 它就会收到此数据
to_addr = ('<broadcast>', 5678)  # <broadcast>会自动改为本局域网的广播ip

# 从键盘获取，要发送的内容
send_data = input('请输入要发送的内容：')

# 发送数据到指定电脑(ip)上的指定程序(port)中
# 使用sendto方法发送数据，发送前，需要先将普通字符串数据转成<字节序列类型>数据
sendData = send_data.encode('utf-8') # 将普通字符串数据转成<字节序列类型>数据
s.sendto(sendData, to_addr)

# 发送完消息，关闭socket
s.close()

# python字节序列类型。python字节序列类型和Node的Buffer一样，都是用于处理二进制数据的工具。通常用于文件I/O、网络通信等