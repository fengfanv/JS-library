import socket

# udp接收数据案例

# 创建upd 套接字（socket.AF_INET代表ipv4，socket.SOCK_DGRAM代表使用upd协议）
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# 设置此udp的网络信息
addr = ('', 6789)  # 注意，这里是元组类型，ip是字符串，端口号是数字。不写ip地址，程序在运行时会自动把ip设成本机ip地址。不绑定端口号，程序在运行时系统会为程序分配一个临时随机端口号
s.bind(addr)

# 循环接收对方发送来的数据（如果不循环，等到 在接收到对方一个数据后，程序就会结束运行）
while True:
    recv_data = s.recvfrom(1024) # 这里1024表示每次接收数据的最大字节数
    # 当前recv_data是<字节序列类型>数据，执行recv_data.decode()可将<字节序列类型>数据转成普通字符串数据
    recv_data2 = recv_data[0].decode()
    # 打印接收到的消息
    print('msg:',recv_data2,'ip:',recv_data[1][0],'port:',recv_data[1][1])

# 关闭socket
s.close()

# python字节序列类型。python字节序列类型和Node的Buffer一样，都是用于处理二进制数据的工具。通常用于文件I/O、网络通信等