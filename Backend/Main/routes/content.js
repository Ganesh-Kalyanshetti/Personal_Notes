const express = require('express');
const router = express.Router();
const Folder = require('../Database/folderschema.js');
const authenticate = require('../Middleware/authentication.js');
// const Content = require('../Database/contentschema.js');
const upload = require('../Database/cloudimg.js')
const multer = require('multer');


//TO add New content
router.get('/createfolder/:id', authenticate, async (req, res) => {
    try {
        const folder = await Folder.findOne({ _id: req.params.id, userId: req.userId });
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' })

        }
        res.json({ content: folder.content,
      foldername: folder.foldername});

    } catch (e) {
        res.status(500).json({ message: 'server error', error: e.message });
    }

});


//To add Updated content
router.put('/createfolder/:id', authenticate, async (req, res) => {
    const { content } = req.body;
    // console.log(content, " Content received");
    // console.log("Incoming content:", content);
    // console.log("Type of content:", typeof content);
    // console.log("Params id:", req.params.id);
    // console.log("User ID:", reqcndvsfd.userId);

    try {

        const updatefolder = await Folder.findOneAndUpdate(

            { _id: req.params.id, userId: req.userId },
            { $set: { content, updatedAt: new Date() } },
            { new: true }

        );

        if (!updatefolder) {

            return res.status(404).json({ message: `Folder not found` });
        }
        // console.log("Updated Folder:", updatefolder);
        
        res.json({ message: `Folder updated`, folder: updatefolder });
    }
    catch (e) {
        res.status(500).json({ message: `Error updating folder` });
    }
});

//To  add images to Cloudinary from user
router.post('/upload-content/:folderid', authenticate, upload.single('photo'), async (req, res) => {
    try {

        // const { text } = req.body;
        const { folderid } = req.params;

        // const newcontent = new Content ({

        //     folderid,
        //     userId:req.userId,
        //     text,
        //     photo:req.file.path // cloudinary url

        // })
        // await newcontent.save();
        res.status(200).json({ message: `Uploaded`, photo: req.file.path });

    }
    catch (e) {
        res.status(500).json({ message: 'Upload Failed', error: e });

    }


});

module.exports = router;