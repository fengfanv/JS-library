import socket

# tcp客户端案例

# 创建socket(tcp)（socket.AF_INET代表ipv4，socket.SOCK_STREAM代表使用tcp协议）
tcp_client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 链接服务器（发送数据前，需要先链接服务器，这就是为什么说tcp是面向连接的原因）
tcp_client_socket.connect(('192.168.31.95', 8080))

# 输入要发送的数据
send_data = input('请输入要发送的数据：')

# 向服务器发送数据
tcp_client_socket.send(send_data.encode())

# 接收服务端返回来的数据（upd里 接收其他人发来的数据，接收的数据里包含对方的(ip地址，端口号，消息内容)。而tcp接收服务端返回来的数据，这个数据里只有消息内容）
recv_data = tcp_client_socket.recv(1024)
print('服务端回复的msg:', recv_data.decode())

# 数据发送完毕，关闭套接字
tcp_client_socket.close()
