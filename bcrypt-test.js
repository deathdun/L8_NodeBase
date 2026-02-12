const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

const passwords = Array.from({ length: 13 }, (_, i) => `pass${String(i + 1).padStart(2, '0')}`);

async function encryptBatch() {
    console.log('Bcrypt encryption benchmark (13 passwords)\n');
    
    const promises = passwords.map(async (pwd, idx) => {
        const start = process.hrtime.bigint();
        const hash = await bcrypt.hash(pwd, SALT_ROUNDS);
        const end = process.hrtime.bigint();
        const elapsedMs = Number(end - start) / 1_000_000;
        
        console.log(`[${idx + 1}] ${pwd} → ${elapsedMs.toFixed(2)} ms`);
        return elapsedMs;
    });

    const times = await Promise.all(promises);
    const total = times.reduce((a, b) => a + b, 0);
    const avg = total / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    console.log('\nStatistics:');
    console.log(`   Total time : ${total.toFixed(2)} ms`);
    console.log(`   Average    : ${avg.toFixed(2)} ms`);
    console.log(`   Min / Max  : ${min.toFixed(2)} ms / ${max.toFixed(2)} ms`);
    console.log('\nWhy times differ?');
    console.log('   - Bcrypt generates a random salt for each hash (cost factor).');
    console.log('   - CPU load and event loop contention also cause variance.');
}

encryptBatch().catch(err => console.error('Error', err));