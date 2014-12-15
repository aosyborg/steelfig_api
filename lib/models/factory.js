
module.exports = Factory;

function Factory (serviceManager) {
    this.name = 'ModelFactory';
    this.serviceManager = serviceManager;
}

Factory.prototype.create = function (name) {
    var Module = require('./' + name),
        model = new Module();

    if (model.setRdb) {
        model.setRdb(
            this.serviceManager.get('rdb')
        );
    }

    return model;
}
