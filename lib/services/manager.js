module.exports = Manager;

var config = require('../../config'),
    Rdb = require('./rdb');

var services = {};

function Manager() {
    this.name = 'ServiceManager';
    this.rdb = initRdb;
};

Manager.prototype.get = function (name) {
    if(!services[name]) {
        try {
            services[name] = this[name]();
        } catch (e) {
            console.error("Unable to load service: " + name, e.message);
            return false;
        }
    }
    return services[name];
};

function initRdb () {
    return new Rdb(config.mysql);
}
