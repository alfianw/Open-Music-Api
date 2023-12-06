const { server } = require("@hapi/hapi");
const routes = require("./routes");
const SongsHandler = require('./handler')

module.exports = {
    name:'songs',
    version: '1.0.0',
    register: async(server,{songsService, validator}) =>{
        const songsHnadler = new SongsHandler(songsService, validator);
        server.route(routes(songsHnadler))
    }
}
