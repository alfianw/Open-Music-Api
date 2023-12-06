const mapDBToSongsModel = ({ id, title, performer }) => ({
    id,
    title,
    performer,
});

const mapDBToDetailSongsModel = ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
}) => ({
    id,
    title,
    year,
    performer,
    duration,
    albumId,
});

module.exports = {mapDBToDetailSongsModel, mapDBToSongsModel}