const express = require('express')
const musicController = require('../controllers/music.controllers')
const router = express.Router()
const multer = require('multer')
const authMiddleware = require('../midllewares/auth.middleware')
const upload = multer({
    storage: multer.memoryStorage()
})

router.post('/upload',authMiddleware.authArtists, upload.single('music'), musicController.createMusic)
router.post('/album',authMiddleware.authArtists, upload.single('music'), musicController.createAlbum)

router.get('/', authMiddleware.authUser, musicController.getAllMusic)
router.get('/albums', authMiddleware.authUser, musicController.getAllAlbums)

router.get('/albums/:albumId', authMiddleware.authUser, musicController.getAlbumById)

module.exports = router 