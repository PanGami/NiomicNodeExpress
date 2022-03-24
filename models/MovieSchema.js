const monggose = require('mongoose');

const MovieSchema = new monggose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    release_on:{
        type: String,
        required: true,
        trim: true        
    }
});
module.exports = monggose.model('Movie', MovieSchema);