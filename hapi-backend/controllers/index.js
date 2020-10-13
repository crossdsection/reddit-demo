const AuthController = require("./auth");
const ThreadController = require("./thread");

const routes = [];
function addToRoutes(controller) {
    for( const route of controller ) {
        routes.push(route);
    }
}
addToRoutes(AuthController);
addToRoutes(ThreadController);

module.exports = routes;
