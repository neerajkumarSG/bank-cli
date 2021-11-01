
module.exports = {
    level: {
        info: false,
        debug: false,
        trace: false,
        warn: true,
        error: true
    },

    log: function (...args) {
        console.log(...args);
    },

    info : function (...args) {
        if(this.level.info)
            console.info('INFO: ', ...args);
    },
    debug: function (...args) {
        if(this.level.debug)
            console.debug('DEBUG: ', ...args);
    },
    trace: function (...args) {
        if(this.level.trace)
         console.trace('TRACE: ', ...args);
    },
    warn: function (...args) {
        if(this.level.warn)
            console.warn(...args);
    },
    error: function (...args) {
        if(this.level.error)
            console.error(...args);
    }
}