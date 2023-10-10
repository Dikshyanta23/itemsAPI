const {StatusCodes} = require('http-status-codes')
const User = require('../models/user')
const {BadRequestError, UnauthenticatedError} = require('../errors')
const bcrypt = require('bcryptjs')

const register = async (req, res)=> {
    const newUser = await User.create({...req.body})
    const token = newUser.createJWT()
    res.status(StatusCodes.CREATED).send({user: {name: newUser.name}, token})
}

const login = async(req, res)=> {
    const {email, password} = req.body;
    //check for empty values
    if (!email || !password) {
        throw new BadRequestError('Please provide both email and password')
    }
    const user = await User.findOne({email})
    //check if the email is in db
    if(!user) {
        throw new UnauthenticatedError(`No user with email ${email} found`)
    }
    //check for matching password
    const isPassCorrect = await user.comparePassword(password)
    if(!isPassCorrect) {
        throw new UnauthenticatedError(`Incorrect password`);
    }
    const token = user.createJWT()
    res
      .status(StatusCodes.OK)
      .send({ user: { name: user.name }, token });  
}

module.exports = {
    login,
    register
}