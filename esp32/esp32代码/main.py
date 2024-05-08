import wifi
import udp

# 连接wifi
wifi.do_connect()

# wifi连接成功后，启动udp服务
udp.udp_socket()