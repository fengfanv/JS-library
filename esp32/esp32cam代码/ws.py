import uwebsockets.client
import time

websocket = None

def start_ws():
    global websocket
    
    try:
        websocket = uwebsockets.client.connect("ws://192.168.31.95:3000/?user=1234")
        websocket.settimeout(0.1) # 为recv()设置一个超时，防止recv接收消息 阻塞 程序进程
        
        while True:
            
            resp = websocket.recv()
            if(resp):
                print("Websocket message: " + resp)
                
            websocket.send("哈哈哈哈哈哈哈")
            
    except KeyboardInterrupt:
        # 清理资源
        websocket.close()
    finally:
        # 清理资源
        websocket.close()

start_ws()

