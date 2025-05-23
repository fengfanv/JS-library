import socket

# tcp服务端案例

# 创建套接字
server_s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 设置此tcp服务器的信息
server_s.bind(('', 8080))

# 将套接字由默认的主动连接模式，改为被动模式(监听模式)
server_s.listen(128)

# 等待客户端来连接此tcp服务
# 当有人连接到此tcp服务时，ret是一个长度为2的元组，
# ret[0]是一个(新套接字)(这个‘新套接字’是专门用来和已经连接到此tcp服务的客户端来进行通信的。tcp通信发送数据前需要先建通道，这个就是那个通道。上面server_s那个套接字是专门用来等待其它客户端来连接用的)
# ret[1]是当前连接上此tcp服务的客户端信息(客户端ip地址，客户端端口号)
ret = server_s.accept()
print('已与客户端', ret[1][0], ret[1][1], '建立tcp通信通道')


while True:
    # 接收客户端发来的数据
    recv_data = ret[0].recv(1024)  # 通过这条与客户端建立的通道，来接收客户端发来的消息
    # 当recv_data收到的数据长度是0，代表客户端已关闭通讯通道(代表客户端已调用tcp_client_socket.close()这个代码)
    # 注意，服务端不能先于客户端 关闭通讯通道（服务端关闭通讯通道，必须得等到客户端关闭通讯通道后(必须得等到客户端调用了tcp_client_socket.close()这个代码后)，然后服务端才能执行关闭通讯通道这个ret[0].close()代码）
    # 如果服务端先于客户端 关闭了通讯通道 则服务端的tcp服务会崩溃挂掉，然后2分钟内无法重启该服务端的tcp服务（在2分钟内，尝试重启该服务端tcp服务时，重启不了，重启多少次，就报错挂掉多少次）
    # 为了表示(当recv_data收到的数据长度是0代表客户端已关闭通讯通道)这个意思，tcp协议规定，tcp客户端不允许发送长度是0的数据
    if len(recv_data) != 0:
        # 当前recv_data是<字节序列类型>数据，执行recv_data.decode()可将<字节序列类型>数据转成普通字符串数据
        recv_data2 = recv_data.decode()
        print('客户端发来的msg', recv_data2)  # 打印客户端发来的消息

        # 给客户端回复数据
        # 使用send方法发送数据，发送前，需要先将普通字符串数据转成<字节序列类型>数据
        sendData = '你可真6'.encode() # 将普通字符串数据转成<字节序列类型>数据
        ret[0].send(sendData) # 通道建立后，可以给客户端回复很多次数据

    else: # recv_data长度是0，客户端已经执行了tcp_client_socket.close()这个代码，所以现在服务端可以执行ret[0].close()这个代码了。客户端已经关闭通讯通道，现在需要服务端关闭通讯通道
        ret[0].close()  # 与客户端的数据“收/发”完毕，关闭这条与客户端建立的通讯通道
        break


# 关闭套接字
# 假如tcp服务端已与某个客户端建立了通信通道，且两人正在相互传送数据中。这时如果我执行server_s.close()代码，是不会影响到 那条服务端与客户端正在传输数据的通道。这时我执行server_s.close()代码，关闭的是专门用来等待其它客户端连接用的套接字，和那个新套接字没有关系。(server_s套接字)和(ret[0]新套接字)没有隶属关系，也没有父子关系，他们两个独立且平等的个体。
server_s.close()

# python字节序列类型。python字节序列类型和Node的Buffer一样，都是用于处理二进制数据的工具。通常用于文件I/O、网络通信等