import socket
import network
from machine import I2S, Pin

# 连接wifi
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
if not wlan.isconnected():
    print('connecting to network...')
    wlan.connect('Xiaomi_FB76', 'xxx')

    while not wlan.isconnected():
        pass
print('网络配置:', wlan.ifconfig())

# 初始化麦克风
sck_pin = Pin(14)
ws_pin = Pin(2)
sd_pin = Pin(15)

try:
    i2s = I2S(0, sck=sck_pin, ws=ws_pin, sd=sd_pin, mode=I2S.RX,
              bits=16, format=I2S.STEREO, rate=8000, ibuf=1024*4)
except Exception as e:
    print('i2s-err', e)


can_get_audio = True
def get_audio(callback):
    global can_get_audio, i2s
    if can_get_audio:
        can_get_audio = False
        audio_content = bytearray()
        rate = 8000
        bits = 16/8
        channel = 2
        record_second = 1  # 秒
        for _ in range(int(rate * bits * channel * record_second / 1024)):
            data = bytearray(1024)
            i2s.readinto(data)
            audio_content += data
        callback(audio_content)


def audio_callback(dataBy):
    global can_get_audio
    can_get_audio = True
    s.sendto(dataBy, ("192.168.31.95", 39990))  # 发送音频数据


# 创建 UDP 服务
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
addr = ('0.0.0.0', 39992)
s.bind(addr)
print('udp启动成功')


try:
    while True:
        get_audio(audio_callback)

except:
    pass
finally:
    i2s.deinit()
