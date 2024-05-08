import socket
import breathingLight
import steeringEngine
import car

def udp_socket():

    # 创建upd 套接字（socket.AF_INET代表ipv4，socket.SOCK_DGRAM代表使用upd协议）
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    # 设置此udp的网络信息
    addr = ('0.0.0.0', 39991)
    s.bind(addr)
    
    print('udp服务启动成功')

    # 循环接收对方发送来的数据（如果不循环，等到 在接收到对方一个数据后，程序就会结束运行）
    while True:
        print('准备接收数据...')
        recv_data = s.recvfrom(1024) # 这里1024表示每次接收数据的最大字节数
        
        # 打印接收到的消息
        value = recv_data[0].decode('utf-8')
        print('msg:',value,'from:',recv_data[1])
        
        if value == 'get_ip':
            s.sendto('1', (recv_data[1][0],recv_data[1][1]))
        elif value == 'to_0':
            steeringEngine.toDeg(0)
        elif value == 'to_90':
            steeringEngine.toDeg(90)
        elif value == 'to_180':
            steeringEngine.toDeg(180)
        elif value == 'car_up':
            car.car_up()
        elif value == 'car_down':
            car.car_down()
        elif value == 'car_left':
            car.car_left()
        elif value == 'car_right':
            car.car_right()
            
    # 关闭socket
    s.close()
    
# udp_socket()