class AlbumsHandler {
    constructor(albumsService, validator, songsService) {
        this._albumsService = albumsService;
        this._songsService = songsService;
        this._validator = validator;
    }

    async postAlbumHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload);
        const { name, year } = request.payload;
        const albumId = await this._albumsService.addAlbum({ name, year });
        const response = h.response({
            status: 'success',
            message: 'Album Added Success!',
            data: {
                albumId,
            },
        });
        response.code(201);
        return response
    }

    async getAlbumsHandler() {
        const albums = await this._albumsService.getAlbums();
        return{
            status: 'success',
            data:{
                albums,
            },
        };
    }

    async getAlbumByIdHandler(request) {
        const {id} = request.params;
        const dataAlbum = await this._albumsService.getAlbumById(id);
        const data ={
            id: dataAlbum.id,
            name: dataAlbum.name,
            year: dataAlbum.year,
        };
        const songs = await this._songsService.getSongsByAlbumId(id);
        const album = {...data, songs};

        return{
            status: 'success',
            data:{
                album,
            },
        };
    }

    async putAlbumByIdHandler(request) {
        this._validator.validateAlbumPayload(request.payload);
        const {id} = request.params;
        await this._albumsService.editAlbumById(id, request.payload);
        return{
            status: 'success',
            message: 'Album has been Update!',
        };
    }

    async deleteAlbumByIdHandler(request) {
        const {id} = request.params;
        await this._albumsService.deleteAlbumById(id);
        return{
            status: 'success',
            message: 'Album has been Deleted!'
        }

    }
}
module.exports = AlbumsHandler;