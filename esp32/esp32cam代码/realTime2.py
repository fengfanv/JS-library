import network
import socket
import camera
from machine import I2S, Pin
import time


# 麦克风初始化
sck_pin = Pin(2)
ws_pin = Pin(15)
sd_pin = Pin(14)
print()
try:
    i2s = I2S(0, sck=sck_pin, ws=ws_pin, sd=sd_pin, mode=I2S.RX, bits=16, format=I2S.MONO, rate=8000, ibuf=1024*4)
except Exception as e:
    print('i2s-err',e)

time.sleep(2)

# 摄像头初始化
try:
    camera.init(0, format=camera.JPEG)
except Exception as e:
    print('camera-err',e)
    camera.deinit()

camera.quality(63)
      













'''
can_get_v = True
def get_v(callback):
    global can_get_v
    if can_get_v:
        can_get_v = False
        dataBy = camera.capture()
        newData = bytearray(dataBy)
        mark = 'v'.encode()
        newData+=mark
        callback(newData)
        time.sleep(0.5)
        can_get_v = True
'''  





'''




# 连接wifi
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
if not wlan.isconnected():
    print('connecting to network...')
    wlan.connect('Xiaomi_FB76', '13483650681')
    
    while not wlan.isconnected():
        pass
print('网络配置:', wlan.ifconfig())



can_get_a = True
def get_a(callback):
    global can_get_a,i2s
    if can_get_a:
        can_get_a = False
        audio_content = bytearray()
        rate = 8000
        bits = 16/8
        channel = 2
        record_second = 1 #秒
        for _ in range(int(rate * bits * channel * record_second / 1024)):
            data = bytearray(1024)
            i2s.readinto(data)
            audio_content += data
        mark = 'a'.encode()
        audio_content += mark
        callback(audio_content)


# socket UDP 的创建
s = socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
addr = ('0.0.0.0', 39992)
s.bind(addr)
print('udp启动成功')

def v_callback(dataBy):
    s.sendto(dataBy, ("192.168.31.95", 39990))  # 发送图像数据
def a_callback(dataBy):
    s.sendto(dataBy, ("192.168.31.95", 39990))  # 发送音频数据
    can_get_a = True        
try:
    while True:
        get_v(v_callback)
        get_a(a_callback)
        
except Exception as e:
    print('pass',e)
    pass
finally:
    camera.deinit()
    i2s.deinit()
'''