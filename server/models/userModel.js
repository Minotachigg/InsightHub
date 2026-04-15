const mongoose = require('mongoose')
const uuidv1 = require('uuidv1')
const crypto = require('crypto')
const { type } = require('os')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    role: {
        type: Number,
        default: 0
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,

    isVerified: {
        type: Boolean,
        default: false
    },
    
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }]

}, { timestamps: true })

// virtual field
userSchema.virtual('password')
    .set(function (password) {
        this._password = password
        this.salt = uuidv1()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })

// defining methods
userSchema.methods = {
    encryptPassword: function (password) {
        if (!password) return ''
        try {
            return crypto
                .Hmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        }
        catch (err) {
            return err
        }
    },
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    }

}

module.exports = mongoose.model('User', userSchema)