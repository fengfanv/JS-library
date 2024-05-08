function pcmToWav(pcmStr, sampleRate, numChannels, bitsPerSample) {
    //（base64编码的pcm文件数据，采样频率，声道数，采样位数）
    let header = {
        // OFFS SIZE NOTES
        chunkId: [0x52, 0x49, 0x46, 0x46], // 0    4    "RIFF" = 0x52494646
        chunkSize: 0, // 4    4    36+SubChunk2Size = 4+(8+SubChunk1Size)+(8+SubChunk2Size)
        format: [0x57, 0x41, 0x56, 0x45], // 8    4    "WAVE" = 0x57415645
        subChunk1Id: [0x66, 0x6d, 0x74, 0x20], // 12   4    "fmt " = 0x666d7420
        subChunk1Size: 16, // 16   4    16 for PCM
        audioFormat: 1, // 20   2    PCM = 1
        numChannels: numChannels || 1, // 22   2    Mono = 1, Stereo = 2...
        sampleRate: sampleRate || 16000, // 24   4    8000, 44100...
        byteRate: 0, // 28   4    SampleRate*NumChannels*BitsPerSample/8
        blockAlign: 0, // 32   2    NumChannels*BitsPerSample/8
        bitsPerSample: bitsPerSample || 16, // 34   2    8 bits = 8, 16 bits = 16
        subChunk2Id: [0x64, 0x61, 0x74, 0x61], // 36   4    "data" = 0x64617461
        subChunk2Size: 0, // 40   4    data size = NumSamples*NumChannels*BitsPerSample/8
    }
    function u32ToArray(i) {
        return [i & 0xff, (i >> 8) & 0xff, (i >> 16) & 0xff, (i >> 24) & 0xff]
    }
    function u16ToArray(i) {
        return [i & 0xff, (i >> 8) & 0xff]
    }

    let pcm = base64ToUint8Array(pcmStr)
    header.blockAlign = (header.numChannels * header.bitsPerSample) >> 3
    header.byteRate = header.blockAlign * header.sampleRate
    header.subChunk2Size = pcm.length * (header.bitsPerSample >> 3)
    header.chunkSize = 36 + header.subChunk2Size

    let wavHeader = header.chunkId.concat(
        u32ToArray(header.chunkSize),
        header.format,
        header.subChunk1Id,
        u32ToArray(header.subChunk1Size),
        u16ToArray(header.audioFormat),
        u16ToArray(header.numChannels),
        u32ToArray(header.sampleRate),
        u32ToArray(header.byteRate),
        u16ToArray(header.blockAlign),
        u16ToArray(header.bitsPerSample),
        header.subChunk2Id,
        u32ToArray(header.subChunk2Size)
    )
    let wavHeaderUnit8 = new Uint8Array(wavHeader)

    let mergedArray = new Uint8Array(wavHeaderUnit8.length + pcm.length)
    mergedArray.set(wavHeaderUnit8)
    mergedArray.set(pcm, wavHeaderUnit8.length)
    let blob = new Blob([mergedArray], { type: 'audio/wav' })
    let blobUrl = window.URL.createObjectURL(blob)
    return blobUrl
}

function base64ToUint8Array(base64Data) {
    // 使用 atob 函数解码 Base64 字符串为二进制字符串  
    const binaryStr = atob(base64Data);

    // 创建一个 Uint8Array，长度与二进制字符串的长度相同  
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);

    // 将二进制字符串的每一个字符的字符码存储到 Uint8Array 中  
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
    }

    return bytes;
}