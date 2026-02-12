const { async } = require('../fs/index.js');

module.exports = {
    create: async.createFile,
    read: async.fetchFile,
    overwrite: async.overwriteFile,
    clear: async.wipeFile,
    clean: async.sanitizeFile,
    copy: async.duplicateFile,
    mkdir: async.makeDirectory,
    rmdir: async.deleteDirectory,
    list: async.scanAllFiles,
    purge: async.purgeProject
};