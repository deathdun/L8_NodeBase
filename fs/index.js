const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// синхрон методы
const sync = {
    createFile: (filePath, content) => fs.writeFileSync(filePath, content, 'utf-8'),

    fetchFile: (filePath) => fs.readFileSync(filePath, 'utf-8'),

    overwriteFile: (filePath, content) => fs.writeFileSync(filePath, content, 'utf-8'),

    wipeFile: (filePath) => fs.writeFileSync(filePath, '', 'utf-8'),

    sanitizeFile: (filePath) => {
        let data = fs.readFileSync(filePath, 'utf-8');
        data = data.replace(/\d+/g, '').toLowerCase();
        fs.writeFileSync(filePath, data, 'utf-8');
        return data;
    },

    duplicateFile: (src, dest) => fs.copyFileSync(src, dest),

    makeDirectory: (dirPath) => fs.mkdirSync(dirPath, { recursive: true }),

    deleteDirectory: (dirPath) => {
        try {
            if (fs.existsSync(dirPath)) {
                fs.rmSync(dirPath, { recursive: true, force: true });
            }
            return true;
        } catch (error) {
            console.error(`Ошибка удаления ${dirPath}:`, error.message);
            return false;
        }
    },

    scanAllFiles: (startPath = '.') => {
        const ignore = ['node_modules', '.git', '.env', 'package-lock.json'];
        const results = [];

        const walk = (currentPath) => {
            const entries = fs.readdirSync(currentPath);
            entries.forEach(entry => {
                const full = path.join(currentPath, entry);
                if (ignore.includes(entry) || entry.startsWith('.env')) return;

                const stat = fs.statSync(full);
                if (stat.isDirectory()) {
                    walk(full);
                } else {
                    results.push(full);
                }
            });
        };
        walk(startPath);
        return results;
    },

    purgeProject: () => {
        const keep = ['.git', 'node_modules', '.env', '.env.*', 'package.json', 'package-lock.json', '.gitignore'];
        const files = sync.scanAllFiles();
        files.forEach(f => fs.unlinkSync(f));

        const dirs = fs.readdirSync('.').filter(e => fs.statSync(e).isDirectory());
        dirs.forEach(d => {
            if (!keep.includes(d) && !d.startsWith('.env')) {
                try { fs.rmdirSync(d, { recursive: true }); } catch { }
            }
        });
        console.log('Проект очищен от временных файлов');
    }
};

// асинхрон методы
const async = {
    createFile: async (filePath, content) => fsPromises.writeFile(filePath, content, 'utf-8'),
    fetchFile: async (filePath) => fsPromises.readFile(filePath, 'utf-8'),
    overwriteFile: async (filePath, content) => fsPromises.writeFile(filePath, content, 'utf-8'),
    wipeFile: async (filePath) => fsPromises.writeFile(filePath, '', 'utf-8'),

    sanitizeFile: async (filePath) => {
        let data = await fsPromises.readFile(filePath, 'utf-8');
        data = data.replace(/\d+/g, '').toLowerCase();
        await fsPromises.writeFile(filePath, data, 'utf-8');
        return data;
    },

    duplicateFile: async (src, dest) => fsPromises.copyFile(src, dest),
    makeDirectory: async (dirPath) => fsPromises.mkdir(dirPath, { recursive: true }),
    deleteDirectory: async (dirPath) => fsPromises.rm(dirPath, { recursive: true }),

    scanAllFiles: async (startPath = '.') => {
        const ignore = ['node_modules', '.git', '.env', 'package-lock.json'];
        const results = [];

        const walk = async (currentPath) => {
            const entries = await fsPromises.readdir(currentPath);
            for (const entry of entries) {
                const full = path.join(currentPath, entry);
                if (ignore.includes(entry) || entry.startsWith('.env')) continue;

                const stat = await fsPromises.stat(full);
                if (stat.isDirectory()) {
                    await walk(full);
                } else {
                    results.push(full);
                }
            }
        };
        await walk(startPath);
        return results;
    },

    purgeProject: async () => {
        const keep = ['.git', 'node_modules', '.env', '.env.*', 'package.json', 'package-lock.json', '.gitignore'];
        const files = await async.scanAllFiles();
        for (const f of files) await fsPromises.unlink(f);

        const dirs = (await fsPromises.readdir('.')).filter(async e => (await fsPromises.stat(e)).isDirectory());
        for (const d of dirs) {
            if (!keep.includes(d) && !d.startsWith('.env')) {
                try { await fsPromises.rmdir(d, { recursive: true }); } catch { }
            }
        }
        console.log('Проект очищен от временных файлов (async)');
    }
};

module.exports = { sync, async };