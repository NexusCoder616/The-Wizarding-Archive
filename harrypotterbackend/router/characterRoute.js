const express=require("express")
const router=express.Router()
const multer=require("multer")
const fs = require("fs")

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"uploads/")
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+"-"+file.originalname)
    }
})

const upload=multer({
    storage:storage
})
const auth = require("../middleware/authMiddleware")

const{addCharacter,getAllCharacters,getCharacterById,updateCharacter,deleteCharacter}
=
require("../controller/characterController")

router.post("/add/character",upload.single("image"),addCharacter)

router.get("/get/characters",auth,getAllCharacters)

router.get("/get/characters/:id",getCharacterById)

router.put("/update/character/:id",updateCharacter)

router.delete("/delete/character/:id",deleteCharacter)

module.exports=router