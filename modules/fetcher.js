const https = require('https');

// Загружает JSON с указанного URL и возвращает объект { data, isLoading, error }

const retrieveData = (url) => {
    return new Promise((resolve) => {
        const result = {
            data: null,
            isLoading: true,
            error: null
        };

        const req = https.get(url, (res) => {
            let raw = '';

            res.on('data', (chunk) => { raw += chunk; });
            res.on('end', () => {
                result.isLoading = false;
                try {
                    result.data = JSON.parse(raw);
                } catch (err) {
                    result.error = err;
                }
                resolve(result);
            });
        });

        req.on('error', (err) => {
            result.isLoading = false;
            result.error = err;
            resolve(result);
        });

        req.setTimeout(5000, () => {
            result.isLoading = false;
            result.error = new Error('Request timeout');
            req.destroy();
            resolve(result);
        });
    });
};

module.exports = { retrieveData };