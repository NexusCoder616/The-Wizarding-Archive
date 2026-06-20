const mongoose=require("mongoose")
const CharacterSchema=new mongoose.Schema({
    name:{
        type:String
    },
    house:{
        type:String
    },
    wand:{
        type:String
    },
    image:{
        type:String
    }
})

module.exports = mongoose.model("Character",CharacterSchema)