const jwt = require('jsonwebtoken')
const musicModel = require('../models/music.model')
const albumModel = require('../models/album.model')
const {uploadFile} = require('../services/storage.services')

async function createMusic(req,res){

    const token = req.cookies.token
    

    const {title} = req.body
    const file = req.file
    
    // upload the music file to imagekit 
    const result = await uploadFile(file.buffer.toString('base64'))
    
    // create a music object to store 
    const music = await musicModel.create({
        uri: result.url,
        title,
        artist: req.user.id
    })


    res.status(201).json({
        message: "Music created successfully",
        music: {
            id: music._id,
            uri: music.uri,
            title: music.title,
            artist: music.artist
        }
    })
}

async function createAlbum(req,res){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({message: "Unauthorized"})
    }

    const {title, musics} = req.body
    
    const album = await albumModel.create({
        title,
        artist: req.user.id,
        musics
    })

    res.status(201).json({
        message: "Album created successfully",
        album: {
            id: album._id,
            title: album.title,
            artist: album.title,
            musics: album.musics
        }
    })
}

async function getAllMusic(req,res){

    const musics = await musicModel
        .find()
        .limit(10) // loads only 10 musics at once (helps prevent overwhelming the server & client)
        .populate('artist')

    res.status(200).json({
        message: "Musics fetched successfully",
        musics: musics
    })
}

async function getAllAlbums(req,res){

    const albums = await albumModel.find().select("title artist").populate('artist', "username email")

    res.status(200).json({
        message: "Albums fetched successfully",
        albums: albums
    })
}

async function getAlbumById(req,res){
    const albumId = req.params.albumId

    const album = await albumModel.findById(albumId).populate("artist", "username email").populate("musics")

    res.status(200).json({
        message: "Album fetched successfully",
        album: album
    })
}

module.exports = { createMusic, createAlbum, getAllMusic, getAllAlbums, getAlbumById }