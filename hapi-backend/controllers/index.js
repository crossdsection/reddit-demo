const AuthController = require("./auth");
const ThreadController = require("./thread");
const PostController = require("./post");

const routes = [];
function addToRoutes(controller) {
    for( const route of controller ) {
        routes.push(route);
    }
}
addToRoutes(AuthController);
addToRoutes(ThreadController);
addToRoutes(PostController);

module.exports = routes;
