def do_connect():
    import network
    import time
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print('connecting to network...')
        wlan.connect('Xiaomi_1042', 'xxx')
        count = 0
        while not wlan.isconnected():
            print('正在连接wifi请稍后...',count)
            time.sleep(1)
            count = count + 1
    print('network config:', wlan.ifconfig())

# do_connect()