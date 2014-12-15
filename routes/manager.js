var ServiceManager = require('../lib/services/manager'),
    Factory = require('../lib/models/factory');

module.exports = Manager;

function Manager (app) {
    this.model_factory = new Factory(new ServiceManager);
    this.app = app;
}

Manager.prototype.register = function (route_object) {
    if (route_object.setModelFactory) {
        route_object.setModelFactory(this.model_factory);
    }

    if (route_object.getRouter) {
        this.app.use(route_object.getRouter());
    } else {
        this.app.use(route_object);
    }

    return this;
}
