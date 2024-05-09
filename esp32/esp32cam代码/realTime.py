import socket
import network
import camera
import time


# 连接wifi
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
if not wlan.isconnected():
    print('connecting to network...')
    wlan.connect('Xiaomi_FB76', 'xxx')

    while not wlan.isconnected():
        pass
print('网络配置:', wlan.ifconfig())


# 摄像头初始化
try:
    # camera.init(0, format=camera.JPEG, fb_location=camera.PSRAM) 经过测试得知camera.PSRAM这个参数没啥用，能拍多大分辨率照片（和摄像头有关系）（和camera.PSRAM没关系）
    camera.init(0, format=camera.JPEG)
except Exception as e:
    camera.deinit()
    camera.init(0, format=camera.JPEG)

# camera.JPEG -- 3
# camera.GRAYSCALE -- 2
# camera.YUV422 -- 1
# camera.RGB565 -- 0


# 摄像头翻转 上翻/下翻 0,1
camera.flip(1)

# 摄像头镜像 左/右 0,1
camera.mirror(1)

# 分辨率
camera.framesize(camera.FRAME_HVGA)
# 选项如下：
# FRAME_96X96 - 96x96 像素
# FRAME_QQVGA - 160x120 像素 (QQVGA代表Quarter Quarter VGA)
# FRAME_QCIF - 176x144 像素 (QCIF代表Quarter CIF)
# FRAME_HQVGA - 240x160 像素 (HQVGA代表Half Quarter VGA)
# FRAME_240X240 - 240x240 像素
# FRAME_QVGA - 320x240 像素 (QVGA代表Quarter VGA)
# FRAME_CIF - 352x288 像素 (CIF代表Common Intermediate Format)
# FRAME_HVGA - 480x320 像素 (HVGA代表Half VGA)
# FRAME_VGA - 640x480 像素 (VGA代表Video Graphics Array)
# FRAME_SVGA - 800x600 像素 (SVGA代表Super VGA)
# FRAME_XGA - 1024x768 像素 (XGA代表Extended Graphics Array)
# FRAME_HD - 1280x720 像素 (HD代表High Definition)
# FRAME_SXGA - 1280x1024 像素 (SXGA代表Super XGA)
# FRAME_UXGA - 1600x1200 像素 (UXGA代表Ultra XGA)
# FRAME_FHD - 1920x1080 像素 (FHD代表Full High Definition)
# FRAME_P_HD - 1600x1200 像素 (P_HD代表Partial High Definition)
# FRAME_P_3MP - 2048x1536 像素 (P_3MP代表Partial 3 Megapixels)
# FRAME_QXGA - 2048x1536 像素 (QXGA代表Quad Extended Graphics Array)
# FRAME_QHD - 2560x1440 像素 (QHD代表Quad High Definition)
# FRAME_WQXGA - 2560x1600 像素 (WQXGA代表Wide Quad Extended Graphics Array)
# FRAME_P_FHD - 2560x1600 像素 (P_FHD代表Partial Full High Definition)
# FRAME_QSXGA - 2560x2048 像素 (QSXGA代表Quad Super XGA)

# 特效(滤镜)
camera.speffect(camera.EFFECT_NONE)
# 选项如下：
# EFFECT_NONE -- 0 无效果（默认）
# EFFECT_NEG -- 1 负片效果
# EFFECT_BW -- 2 黑白效果
# EFFECT_RED -- 3 红色效果
# EFFECT_GREEN -- 4 绿色效果
# EFFECT_BLUE -- 5 蓝色效果
# EFFECT_RETRO -- 6 复古效果

# 白平衡
# camera.whitebalance(camera.WB_NONE)
# 选项如下：
# WB_NONE -- 0 无/自动白平衡
# WB_SUNNY -- 1 晴天/日光白平衡
# WB_CLOUDY -- 2 多云/阴天白平衡
# WB_OFFICE -- 3 办公室/室内白平衡/荧光灯白平衡
# WB_HOME -- 4 家庭/室内白平衡/白炽灯白平衡

# 饱和度
camera.saturation(0)
# -2至2（默认为0）    -2灰度

# 亮度
camera.brightness(0)
# -2至2（默认为0）    2明亮

# 对比度
camera.contrast(0)
# -2至2（默认为0）    2高对比度

# 质量
camera.quality(20)
# 10-63 数字越小质量越高

# socket UDP 的创建
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
addr = ('0.0.0.0', 39992)
# 0.0.0.0是一个特殊的ip地址，通常被称为“通配符地址”或“默认路由地址”
# 0.0.0.0作为一个特殊的ip地址，在服务器上下文中通常用于表示“监听所有可用的网络接口”。这样做的好处是，您无需关心计算机连接到哪些网络或具有哪些ip地址，只要确保服务器进程配置正确，它就可以从任何网络接收连接
# 如果你的电脑有两个网卡，一个直接连接到了外网（ip地址是172.112.xxx.xxx），另一个连接到了一个局域网（ip地址是192.168.xxx.xxx），并且你电脑上运行了一个监听0.0.0.0:9999的服务器，那么：
# 不论你是从外网通过172.112.xxx.xxx:9999访问 还是 从局域网通过192.168.xxx.xxx:9999访问，你电脑收到 消息 后都会将消息 交给 你电脑上监听0.0.0.0:9999的服务器
s.bind(addr)
try:
    while True:
        buf = camera.capture()  # 获取图像数据
        s.sendto(buf, ("192.168.31.95", 39990))  # 向服务器发送图像数据
        time.sleep(0.1)
except:
    pass
finally:
    camera.deinit()