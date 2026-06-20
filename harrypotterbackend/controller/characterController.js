const Character = require("../models/Character")
const cloudinary = require("../config/cloudinary")



const addCharacter = async (req, res) => {

    try {

        let imageUrl

        if (req.file) {
            // A file was uploaded via Form-data — send it to Cloudinary
            const result = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: "harrypotter"
                }
            )

            imageUrl = result.secure_url

        } else if (req.body.image) {
            // A direct Cloudinary URL was provided in the JSON body — use it directly
            imageUrl = req.body.image

        } else {
            return res.status(400).json({
                success: false,
                message: "Please provide an image file or an image URL"
            })
        }

        const character = await Character.create({

            name: req.body.name,
            house: req.body.house,
            wand: req.body.wand,
            image: imageUrl

        })

        res.status(201).json({

            success: true,
            message: "Character Added Successfully",
            character

        })

    }
    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        })

    }

}




const getAllCharacters = async (req, res) => {

    try {

        const characters = await Character.find()

        res.status(200).json({

            success: true,
            totalCharacters: characters.length,
            characters

        })

    }
    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        })

    }

}




const getCharacterById = async (req, res) => {

    try {

        const character = await Character.findById(req.params.id)

        if (!character) {

            return res.status(404).json({

                success: false,
                message: "Character Not Found"

            })

        }

        res.status(200).json({

            success: true,
            character

        })

    }
    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        })

    }

}




const updateCharacter = async (req, res) => {

    try {

        const character = await Character.findByIdAndUpdate(

            req.params.id,

            {
                name: req.body.name,
                house: req.body.house,
                wand: req.body.wand
            },

            {
                new: true
            }

        )

        if (!character) {

            return res.status(404).json({

                success: false,
                message: "Character Not Found"

            })

        }

        res.status(200).json({

            success: true,
            message: "Character Updated Successfully",
            character

        })

    }
    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        })

    }

}



const deleteCharacter = async (req, res) => {

    try {

        const character = await Character.findByIdAndDelete(
            req.params.id
        )

        if (!character) {

            return res.status(404).json({

                success: false,
                message: "Character Not Found"

            })

        }

        res.status(200).json({

            success: true,
            message: "Character Deleted Successfully"

        })

    }
    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        })

    }

}


module.exports = {

    addCharacter,
    getAllCharacters,
    getCharacterById,
    updateCharacter,
    deleteCharacter

}