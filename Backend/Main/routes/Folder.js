const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Content = require('../Database/contentschema.js');
const Folder = require('../Database/folderschema.js');
require('dotenv').config();

router.post('/createfolder', async (req, res) => {

    const { foldername } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        const userId = decoded.userId;

        const newfolder = new Folder({
            userId, foldername, content: ''
        });

        await newfolder.save();
        res.status(201).json({ message: `Folder Created`, folder: newfolder });
    }
    catch (e) {
        console.log('Error in creatinf folder', e);
        res.status(500).json({ message: "Server error" });

    }
})

router.get('/getfolders', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {

        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        const folders = await Folder.find({ userId: decoded.userId }).sort({ createdAt: -1 });
        res.status(200).json({ folders });
    }
    catch (e) {
        console.log('Error fetching folders:', e);
        res.status(500).json({ message: "Server error" });
    }
})

// DELETE folders route
router.post('/deletefolders', async (req, res) => {
    const { folderIds } = req.body; // Array of folder IDs to delete
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    if (!folderIds || !Array.isArray(folderIds) || folderIds.length === 0) {
        return res.status(400).json({ message: "No folder IDs provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        const userId = decoded.userId;

        // Delete folders only if they belong to this user
        const result = await Folder.deleteMany({
            _id: { $in: folderIds },
            userId: userId
        });

        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Folders deleted successfully", deletedCount: result.deletedCount });
        } else {
            res.status(404).json({ message: "No folders deleted. Either not found or not authorized." });
        }
    } catch (error) {
        console.error('Error deleting folders:', error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

