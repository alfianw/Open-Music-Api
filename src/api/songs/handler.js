class SongsHandler{
    constructor(songsService, validator){
        this._songsService = songsService;
        this._validator = validator;
    }

    async postSongHandler(request, h){
        this._validator.validateSongPayload(request.payload);
        const {
            title, year, genre, performer, duration, albumId,
        }= request.payload;
        const songId = await this._songsService.addSong({
            title,
            year,
            genre,
            performer,
            duration,
            albumId,
        });

        const response = h.response({
            status:'success',
            message: 'song added success!',
            data:{
                songId,
            },
        });
        response.code(201);
        return response
    }

    async getSongsHandler(request){
        const{title, performer} = request.query;
        const songs = await this._songsService.getSongs(title, performer);
        return{
            status: 'success',
            data:{
                songs,
            },
        };
    }

    async getSongByIdHandler(request){
        const {id} = request.params;
        const song = await this._songsService.getSongById(id);
        return{
            status: 'success',
            data:{
                song,
            },
        };
    }

    async putSongByIdHandler(request){
        this._validator.validateSongPayload(request.payload);
        const {id} = request.params;
        await this._songsService.editSongById(id, request.payload);
        return{
            status: 'success',
            message: 'Song has been updated',
        };
    }

    async deleteSongByIdHandler(request){
        const {id} = request.params;
        await this._songsService.deleteSongById(id);
        return{
            status: 'success',
            message: 'Song has been deleted'
        };
    }
}

module.exports = SongsHandler;