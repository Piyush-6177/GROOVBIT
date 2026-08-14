const ImageKit = require('@imagekit/nodejs')
const { Folders } = require('@imagekit/nodejs/resources/index.js')


const ImageKitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function uploadFile(file){

    const result = await ImageKitClient.files.upload({
        file, 
        fileName: "music_" + Date.now(),
        folder: 'spotify-full/music' 
    })

    return result 
}

module.exports = { uploadFile }