const AuthController = require("./auth");
const ThreadController = require("./thread");
const PostController = require("./post");
const ReactionTypeController = require("./reactiontype");
const ReactionController = require("./react");

const routes = [];
function addToRoutes(controller) {
    for( const route of controller ) {
        routes.push(route);
    }
}
addToRoutes(AuthController);
addToRoutes(ThreadController);
addToRoutes(PostController);
addToRoutes(ReactionTypeController);
addToRoutes(ReactionController);

module.exports = routes;
