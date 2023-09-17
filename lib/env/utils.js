export function getOsEnv(key) {
    if (typeof process.env[key] === 'undefined') {
        throw new Error(`Environment variable ${key} is not set.`);
    }

    return process.env[key] ;
}

export function toNumber(value) {
    return parseInt(value, 10);
}

export function toBool(value) {
    return value === 'true';
}

export function normalizePort(port){
    const parsedPort = parseInt(port, 10);
    if (isNaN(parsedPort)) {
        return port;
    }
    if (parsedPort >= 0) { // port number
        return parsedPort;
    }
    return false;
}