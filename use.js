require('dotenv').config();
const { retrieveData } = require('./modules/fetcher.js');
const { sortByAlphabetNoSpaces } = require('./modules/sort.js');
const fs = require('./modules/fs-modules.js');

const API_URL = 'https://jsonplaceholder.typicode.com/users';

(async () => {
    try {
        console.log('Fetching users…');
        const { data, error, isLoading } = await retrieveData(API_URL);
        
        if (error) throw error;
        if (!data || !Array.isArray(data)) throw new Error('Invalid data format');
        
        console.log(`Loaded ${data.length} users\n`);

        const rawNames = data.map(user => user.name);
        const emails = data.map(user => user.email);

        const sortedNames = sortByAlphabetNoSpaces(rawNames);

        await fs.mkdir('users');
        await fs.create('users/names.txt', sortedNames.join('\n'));
        await fs.create('users/emails.txt', emails.join('\n'));

        console.log('Folder "users" created.');
        console.log('names.txt — имена (отсортированы, пробелы игнорировались)');
        console.log('emails.txt — электронные почты');
        console.log('\nFirst 5 names:');
        sortedNames.slice(0, 5).forEach((name, i) => console.log(`   ${i + 1}. ${name}`));
        
    } catch (err) {
        console.error('Integration error:', err.message);
    }
})();