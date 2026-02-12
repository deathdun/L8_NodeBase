const os = require('os');

const toGB = (bytes) => (bytes / 1024 ** 3).toFixed(2);

const printSystemSpecs = () => {
    const interfaces = os.networkInterfaces();
    const ipv4Addresses = [];

    Object.keys(interfaces).forEach(iface => {
        interfaces[iface].forEach(addr => {
            if (addr.family === 'IPv4' && !addr.internal) {
                ipv4Addresses.push(`${iface}: ${addr.address}`);
            }
        });
    });

    console.log('System Information');
    console.log(`   Platform   : ${os.platform()} ${os.arch()}`);
    console.log(`   Hostname   : ${os.hostname()}`);
    console.log(`   Home dir   : ${os.homedir()}`);
    console.log(`   Free memory: ${toGB(os.freemem())} GB`);
    console.log(`   Network    : ${ipv4Addresses.join(', ') || 'нет внешних IPv4'}`);
};

const isMemorySufficient = () => {
    const freeGB = os.freemem() / 1024 ** 3;
    const ok = freeGB > 4;
    console.log(`Free RAM: ${freeGB.toFixed(2)} GB — ${ok ? 'Yes >4GB' : 'No ≤4GB'}`);
    return ok;
};


const restrictedSystemInfo = () => {
    const mode = process.env.MODE || 'user';
    if (mode.toLowerCase() === 'admin') {
        printSystemSpecs();
    } else {
        console.log('Access denied. Full system info requires MODE=admin');
        console.log(`   Limited info: ${os.platform()} ${os.arch()}, ${os.hostname()}`);
    }
};

module.exports = {
    printSystemSpecs,
    isMemorySufficient,
    restrictedSystemInfo
};