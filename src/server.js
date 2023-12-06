require('dotenv').config();
const Hapi = require('@hapi/hapi');
const AlbumsService = require('./services/postgre/AlbumsService');
const SongService = require('./services/postgre/SongService');
const AlbumsValidator = require('./validator/albums')
const SongValidator = require('./validator/songs')
const albums = require('./api/albums')
const songs = require('./api/songs');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
    const albumsService = new AlbumsService();
    const songsService = new SongService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register([
        {
            plugin: albums,
            options: {
                albumsService,
                songsService,
                validator: AlbumsValidator,
            },
        },
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongValidator,
            }
        }
    ])

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;
        if (response instanceof Error) {
            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message,
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }

            if (!response.isServer) {
                return h.continue;
            }

            const newResponse = h.response({
                status: 'error',
                message: `Sorry, service time out, ${response.message}`,
            });

            console.log(`error: ${response.message}`);
            newResponse.code(500);
            return newResponse;
        }
        return h.continue;
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
