const dotenv = require('dotenv');
dotenv.config();

const { NAME, SURNAME, GROUP, INDEX, MODE } = process.env;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log('Node.js application started');
console.log(`Environment: ${NODE_ENV}`);
console.log(`Developer: ${NAME} ${SURNAME}`);
console.log(`Group: ${GROUP}  |  #${INDEX}`);
console.log(`Mode: ${MODE}`);
