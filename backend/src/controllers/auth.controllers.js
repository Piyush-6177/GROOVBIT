const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

async function registerUser(req,res){

    const {username, email, password, role='user'} = req.body

    // check if this user already exists
    const isUserAlreadyExists = await userModel.findOne({

        $or: [
            {username},
            {email}
        ]
    })
    // if user already exists alert
    if(isUserAlreadyExists){

        return res.status(409).json({
            message : "User already exist"
        })
    }

    // hash the password (add some salt)
    const hash = await bcrypt.hash(password,10)

    // if user new >>> create a new user account
    const user = await userModel.create({
        username,
        email,
        password: hash,
        role
    })
    // create a token for the user 
    const token = jwt.sign({
        id: user._id,
        role: user.role
    },process.env.JWT_SECRET)

    // set the token to cookie
    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        'user': {
            id: user._id,
            username: user.username,
            email: (await user).email,
            role: user.role
        }
    })
}

async function loginUser(req,res){

    const {username, email, password} = req.body

    const user = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    // no user present with that credential >>> alert
    if(!user){
        return res.status(401).json({
            message: "Inbvalid Credentials"
        })
    }

    // check if entered password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password)
    // if password is not valid >>> alert
    if(!isPasswordValid){
        return res.status(401).json({message: "Invalid credentials"})
    }

    // if password is valid create a token for the user
    const token = await jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET)
    // set the token to cookie
    res.cookie("token", token)

    res.status(201).json({
        message: "User logged in successfully",
        "User": {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })

}

async function logoutUser(req,res){
    res.clearCookie("token")

    res.status(200).json({message: "User logged out successfully"})
}

module.exports = {registerUser, loginUser, logoutUser}