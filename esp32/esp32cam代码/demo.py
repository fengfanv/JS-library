# 等待接收数据的同时，不阻塞发送数据
# 默认情况下，等待接收数据，会堵塞程序进程
import socket
import time
import select

# 创建UDP套接字
udp = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# 绑定到本地地址和端口
udp.bind(('0.0.0.0', 39993))

# 发送数据的目标地址和端口
send_addr = ('192.168.31.95', 39990)

# 发送消息的内容
send_message = b"Hello from ESP32"

# 接收数据缓存大小
recv_buffer = 1024

# 主循环
while True:
    # 尝试发送数据
    try:
        udp.sendto(send_message, send_addr)
        print(f"Sent: {send_message.decode()}")
    except OSError as e:
        print(f"Send error: {e}")

    # 延时一段时间再发送下一个消息
    time.sleep(1)

    # 尝试接收数据（非阻塞）
    try:
        readable, _, _ = select.select([udp], [], [], 0)  # 0秒超时，非阻塞
        if udp in readable:
            data, addr = udp.recvfrom(recv_buffer)
            print(f"Received from {addr}: {data.decode()}")
    except OSError as e:
        # 处理可能的异常，如套接字错误
        print(f"Receive error: {e}")

# 注意：在实际应用中，你可能需要处理更多的异常情况和边界条件
