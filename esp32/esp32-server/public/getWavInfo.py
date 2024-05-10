import wave

wavFile = "./rwyuw-wnvqz.wav"

wr = wave.open(wavFile, 'rb')

print(wr.getnchannels())  # 返回声道数量（1 为单声道，2 为立体声）
print(wr.getsampwidth()*8)  # 返回采样字节长度（这里乘8，是为了将字节转成位）
print(wr.getframerate())  # 返回采样频率
