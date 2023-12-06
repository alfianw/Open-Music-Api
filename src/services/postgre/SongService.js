const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const { mapDBToSongsModel, mapDBToDetailSongsModel } = require("../../untils/Songs");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongService{
    constructor(){
        this._pool = new Pool();
    }

    async addSong({title, year, genre, performer, duration = null, albumId = null }){
        const id = nanoid(16);
        const query = {
            text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            values: [id, title, year, genre, performer, duration, albumId],
        };
        const result = await this._pool.query(query);
        if(!result.rows[0].id){
            throw new InvariantError('Failed added song');
        }
        return result.rows[0].id;
    }

    async getSongs(title, performer){
        const query ='SELECT * FROM songs';
        if(title !== undefined){
            query = {
                text:'SELECT * FROM song WHERE LOWER(performer) LIKE LOWER($1)',
                values: [`%${performer}%`],
            };
        }
        if(title !== undefined && performer !== undefined){
            query ={
                text: 'SELECT * FROM songs WHERE LOWER(title) LIKE LLOWER($1) AND LOWER(performer) LIKE LOWER($2)',
                values:[`%${title}%`, `%${performer}%`],
            }
        }
        const result = await this._pool.query(query);
        if(!result.rows.length){
            return [];
        }
        return result.rows.map(mapDBToSongsModel);
    }

    async getSongById(id){
        const query ={
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError('Song not found');
        }
        return result.rows.map(mapDBToDetailSongsModel)[0];
    }

    async getSongsByAlbumId(albumId){
        const query = {
            text: 'SELECT songs.id, title, performer FROM songs LEFT JOIN albums ON songs.album_id = albums.id WHERE album_id = $1',
            values: [albumId],
        }
        const result = await this._pool.query(query);

        if(!result.rowCount){
            return [];
        }
        return result.rows;
    }

    async getSongsByPlaylistId(playlistId){
        const query = {
            text: 'SELECT songs.id, songs.title, songs.performer FROM songs LEFT JOIN playlist_song ON songs.id = playlist_song.song_id WHERE playlist_songs.playlist_id = $1',
            values: [playlistId],
        };
        const result = await this._pool.query(query);
        if(!result.rowCount){
            return [];
        }
        return result.rows;

    }

    async editSongById(id,{title, genre, performer, duration = null , albumId = null}){
        const query = {
            text: 'UPDATE songs SET title = $1, year = $, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
            values: [title, year, genre, performer, duration, albumId, id],
        };

        const result = await this._pool.query(query);
        if(!result.rows.length){
            throw new NotFoundError('Songs updated failed, id not found');
        }
    }

    async deleteSongById(id){
        const query ={
            text:'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        };
        const result =await this._pool.query(query);
        if(!result.rows.length){
            throw new NotFoundError('Songs Deleted failed, id not found');
        };
    }
}

module.exports = SongService