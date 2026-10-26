const mongoose = require('mongoose')

// cache the connection so serverless invocations reuse it instead of reconnecting
let connection = null

async function connectDB(){

    if(!connection){
        connection = mongoose.connect(process.env.MONGO_URI)
            .then(()=> console.log("Connected to DB"))
            .catch((err)=>{
                connection = null
                throw err
            })
    }

    return connection

}

module.exports = connectDB
