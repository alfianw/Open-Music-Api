const mapDBToDetailAlbumsModel = ({ id, name, year, musics }) => ({
    id,
    name,
    year,
    musics,
});

const mapDBToAlbumsModel = ({
    id,
    name, 
    year, 
    musics,
}) =>({
    id,
    name,
    year,
    musics,
})

module.exports ={mapDBToAlbumsModel, mapDBToDetailAlbumsModel}