
//获取本机局域网IP地址
function GET_LAN_IP() {
    const interfaces = require('os').networkInterfaces();
    var IPAddress = 'localhost';
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                IPAddress = alias.address;
            }
        }
    }
    return IPAddress;
}
exports.GET_LAN_IP = GET_LAN_IP;