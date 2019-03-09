const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

const config = require('../config.json');

const error = (msg, obj) => {
    console.error(`${RED}[ERROR]${RESET} ${msg}`, obj || '');
};

const info = (msg) => {
    console.info(`${CYAN}[INFO]${RESET} ${msg}`);
};

const warn = (msg) => {
    console.warn(`${YELLOW}[WARN]${RESET} ${msg}`);
};

const debug = (msg, obj) => {
    if (config.ENVIRONMENT === 'development') {
        console.log(`${BLUE}[DEBUG]${RESET} ${msg}`, obj || '');
    }
};

module.exports = {
    error,
    info,
    warn,
    debug
};