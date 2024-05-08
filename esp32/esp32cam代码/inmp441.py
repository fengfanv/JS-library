from machine import I2S, Pin
import time

# 音频录制函数
def record_audio():
    # 定义SCK（时钟信号）用于同步数据传输的时钟。
    sck_pin = Pin(14, Pin.OUT)
    # 定义WS（字选择信号）用于指示数据字的开始和结束。
    ws_pin = Pin(2, Pin.OUT)
    # 定义SD（数据信号）传输音频数据的信号。
    sd_pin = Pin(15, Pin.OUT)

    # I2S.RX 接收模式
    # I2S.STEREO 双声道(立体声)音频(表示音频通道数有2个。左声道及右声道)。I2S.MONO单声道音频(表示音频通道数有1个。左声道或右声道)
    # rate 采样率(Hz)。表示每秒钟内采集多少个样本。采样率8000意思是，每秒钟内采样8000个样本
    # bits 采样位数。表示每个样本的位数。1字节=8位(1B=8b 或 1byte=8bit)。表示每个样本能够表示的精度，更高的位数意味着更精确的音频表示。8、16、24、32
    # ibuf I2S内部缓冲区长度(字节)
    i2s = I2S(0, sck=sck_pin, ws=ws_pin, sd=sd_pin, mode=I2S.RX,
              bits=16, format=I2S.STEREO, rate=8000, ibuf=1024*8)

    print("开始录音，请说话...")

    # 创建一个空的bytearray用于存储录音数据
    audio_content = bytearray()

    # 音频文件大小(字节) = 采样率 × (采样位数/8) × 通道数 × 音频时长(秒)
    rate = 8000  # 每秒钟内采集多少个样本
    bits = 16/8  # 每个样本的位数。这里16/8是为了将比特位(bit)转换成字节(byte)
    channel = 2  # 音频通道数量
    record_second = 8  # 录音时长(秒)

    # 循环读取I2S数据，持续时间为record_seconds秒
    for _ in range(int(rate * bits * channel * record_second / 1024)):
        # 创建一个1024字节的bytearray用于临时存储读取的数据
        data = bytearray(1024)
        # 从I2S接口读取数据到data中
        i2s.readinto(data)
        # 将读取的数据追加到audio_content中
        audio_content += data

    print(type(audio_content))
    print("录音结束")
    # 释放I2S资源
    i2s.deinit()

    # 使用二进制 写模式 打开文件，写入录音数据
    # PCM全称是 脉冲编码调制(Pulse Code Modulation)，通过将模拟信号(模拟语音信号)变换为数字信号，以进行传输和存储音频数据。通常称为PCM裸流或音频裸数据。由于它直接转换模拟信号为数字信号，没有丢弃任何原始数据，所以PCM的优点就是音质好，缺点就是体积大。
    # pcm与mp3区别
    # pcm无损无压缩
    # mp3有损有压缩
    audioName = "第一个音频"+str(time.time())+".pcm"
    with open(audioName, "wb") as f:
        f.write(audio_content)
        print("录音保存成功！")


record_audio()
