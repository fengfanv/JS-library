from machine import I2S, Pin

'''
LRC（ws）
BCLK（sck）
DIN（sd）

GND
VIN
'''

# 定义SCK（时钟信号）用于同步数据传输的时钟。
sck_pin = Pin(14, Pin.OUT)
# 定义WS（字选择信号）用于指示数据字的开始和结束。
ws_pin = Pin(2, Pin.OUT)
# 定义SD（数据信号）传输音频数据的信号。
sd_pin = Pin(15, Pin.OUT)


# 播放pcm文件
def play_audio(pcmfile, rate, bits, channels):
    '''
    sck 是串行时钟线的引脚对象
    ws 是单词选择行的引脚对象
    sd 是串行数据线的引脚对象
    mode 指定接收或发送
    bits 指定样本大小（位），16 或 32
    format 指定通道格式，STEREO（双声道（左右声道）） 或 MONO（单声道）
    rate 指定音频采样率（样本/秒）
    ibuf 指定内部缓冲区长度（字节）
    '''

    # 初始化i2s
    audio_out = I2S(0, sck=sck_pin, ws=ws_pin, sd=sd_pin, mode=I2S.TX,
                    bits=bits, format=channels, rate=rate, ibuf=1024*4)

    try:
        with open(pcmfile, 'rb') as f:

            # 创建一个缓冲区来存储音频样本
            wav_samples = bytearray(1024)  # 每次读取1024字节（对于16位音频为512个样本）

            print('开始播放音频...')

            # 循环读取并播放音频样本（边读边播。读一点，播放一点）
            while True:
                # 读取音频样本到缓冲区，readinto()方法返回每次读取到的字节数
                num_read = f.readinto(wav_samples)

                # 如果没有读取到任何数据（即已到达文件末尾），则跳出循环
                if num_read == 0:
                    break

                # 写入音频样本到I2S DAC
                # 由于I2S.write()可能无法一次性写入整个缓冲区，所以需要循环写入
                offset = 0
                while offset < num_read:
                    # write()方法返回每次写入的字节数，因此我们需要更新offset和num_read
                    written = audio_out.write(wav_samples[offset:offset+num_read])
                    offset += written

    except Exception as e:
        print('发生错误:', e)
    finally:
        # 清理资源，关闭I2S
        audio_out.deinit()
        print('音频播放结束')

# play_audio('第一个音频767890177.pcm', 8000, 16, I2S.STEREO)

# -----------------------------------------------------------------------------

# Waveform Audio File Format（WAVE, 文件后缀.wav），它采用RIFF（Resource Interchange File Format）文件格式结构。通常用来保存PCM格式的原始音频数据，所以通常被称为无损音频。但是严格意义上来讲，WAV也可以存储其它压缩格式的音频数据。

def read_wav_header(file_path):
    with open(file_path, 'rb') as file:
        # 读取wav文件头信息
        riff_chunk_id = file.read(4)
        riff_chunk_size = int.from_bytes(file.read(4), 'little')
        riff_format = file.read(4)

        fmt_chunk_id = file.read(4)
        fmt_chunk_size = int.from_bytes(file.read(4), 'little')
        audio_format = int.from_bytes(file.read(2), 'little')
        num_channels = int.from_bytes(file.read(2), 'little')
        sample_rate = int.from_bytes(file.read(4), 'little')
        byte_rate = int.from_bytes(file.read(4), 'little')
        block_align = int.from_bytes(file.read(2), 'little')
        bits_per_sample = int.from_bytes(file.read(2), 'little')

        return {
            'sample_rate': sample_rate,  # 音频采样率
            'bits_per_sample': bits_per_sample,  # 音频样本位数
            'num_channels': num_channels  # 通道数
        }


def play_wav(file_path):

    wav_info = read_wav_header(file_path)
    print(wav_info) # {'sample_rate': 8000, 'bits_per_sample': 16, 'num_channels': 2}

    rate = wav_info['sample_rate']
    bits = wav_info['bits_per_sample']
    channels = None
    if wav_info['num_channels'] == 1:
        channels = I2S.MONO
    elif wav_info['num_channels'] == 2:
        channels = I2S.STEREO

    # 初始化i2s
    audio_out = I2S(0, sck=sck_pin, ws=ws_pin, sd=sd_pin, mode=I2S.TX,
                    bits=bits, format=channels, rate=rate, ibuf=1024*4)

    try:
        with open(file_path, 'rb') as f:

            # 跳过WAV文件的头部信息（通常为44字节）
            f.seek(44)

            # 创建一个缓冲区来存储音频样本
            wav_samples = bytearray(1024)  # 每次读取1024字节（对于16位音频为512个样本）

            print('开始播放音频...')

            # 循环读取并播放音频样本（边读边播。读一点，播放一点）
            while True:
                # 读取音频样本到缓冲区，readinto()方法返回每次读取到的字节数
                num_read = f.readinto(wav_samples)

                # 如果没有读取到任何数据（即已到达文件末尾），则跳出循环
                if num_read == 0:
                    break

                # 写入音频样本到I2S DAC
                # 由于I2S.write()可能无法一次性写入整个缓冲区，所以需要循环写入
                offset = 0
                while offset < num_read:
                    # write()方法返回每次写入的字节数，因此我们需要更新offset和num_read
                    written = audio_out.write(wav_samples[offset:offset+num_read])
                    offset += written

    except Exception as e:
        print('发生错误:', e)
    finally:
        # 清理资源，关闭I2S
        audio_out.deinit()
        print('音频播放结束')


# play_wav('第一个音频768313177.wav')

# -----------------------------------------------------------------------------

'''
import network
import urequests


# 连接wifi
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
if not wlan.isconnected():
    print('connecting to network...')
    wlan.connect('Xiaomi_1042', 'xxx')

    while not wlan.isconnected():
        pass
print('网络配置:', wlan.ifconfig())


def request_wav_header(wav_url):

    response = urequests.get(wav_url, stream=True)

    file = response.raw

    # 读取wav文件头信息
    riff_chunk_id = file.read(4)
    riff_chunk_size = int.from_bytes(file.read(4), 'little')
    riff_format = file.read(4)

    fmt_chunk_id = file.read(4)
    fmt_chunk_size = int.from_bytes(file.read(4), 'little')
    audio_format = int.from_bytes(file.read(2), 'little')
    num_channels = int.from_bytes(file.read(2), 'little')
    sample_rate = int.from_bytes(file.read(4), 'little')
    byte_rate = int.from_bytes(file.read(4), 'little')
    block_align = int.from_bytes(file.read(2), 'little')
    bits_per_sample = int.from_bytes(file.read(2), 'little')

    # 关闭HTTP响应流
    response.close()

    return {
        'sample_rate': sample_rate,  # 音频采样率
        'bits_per_sample': bits_per_sample,  # 音频样本位数
        'num_channels': num_channels  # 通道数
    }


wav_url = 'http://192.168.31.95/rwyuw-wnvqz.wav'

# 根据要播放的wav音频来初始化i2s
wav_info = request_wav_header(wav_url)

print(wav_info) # {'sample_rate': 44100, 'bits_per_sample': 16, 'num_channels': 2}

rate = wav_info['sample_rate']
bits = wav_info['bits_per_sample']
channels = None
if wav_info['num_channels'] == 1:
    channels = I2S.MONO
elif wav_info['num_channels'] == 2:
    channels = I2S.STEREO

# 初始化I2S用于音频输出
audio_out = I2S(0, sck=sck_pin, ws=ws_pin, sd=sd_pin, mode=I2S.TX,
                bits=bits, format=channels, rate=rate, ibuf=1024*4)

# 在HTTP响应的流式处理中，一旦你从response.raw流中读取了一些数据（比如跳过了前44个字节），那这些被读取过(被跳过)的数据就无法再“重新读取”。
# HTTP响应流是一个单向的、一次性的数据流，它只能按照数据的发送顺序被读取一次。
# 因此假如你跳过了前44个字节后，你又想从头开始读，你可以通过 重新发起HTTP请求 的方式来实现。
response = urequests.get(wav_url, stream=True)

response.raw.read(44)  # 跳过WAV文件的头部信息（通常为44字节）

print('开始播放音频...')

try:
    # 循环读取并播放音频样本（边读边播。读一点，播放一点）
    while True:
        content_byte = response.raw.read(1024)  # 每次读取1024个字节

        # 如果没有读取到任何数据（即已到达文件末尾），则跳出循环
        if len(content_byte) == 0:
            break

        # 调用I2S实例播放音频
        audio_out.write(content_byte)

except Exception as e:
    print('发生错误:', e)
finally:
    # 清理资源，关闭I2S
    audio_out.deinit()
    # 关闭HTTP响应流
    response.close()
    print('音频播放结束')
'''