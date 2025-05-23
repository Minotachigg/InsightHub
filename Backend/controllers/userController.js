const User = require('../models/userModel')
const Token = require('../models/tokenModel')
const crypto = require('crypto')
const sentEmail = require('../utils/sentEmail')
const jwt = require('jsonwebtoken') // authenticate
const { expressjwt } = require('express-jwt') // authorization

// TO REGISTER USER
exports.postUser = async (req, res) => {
    let user = User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    // check if the user is already registered or not
    User.findOne({ email: user.email })
        .then(async data => {
            if (data) {
                return res.status(400).json({ error: 'Email already registered.' })
            } else {
                user = await user.save()

                if (!user) {
                    return res.status(400).json({ error: 'Failed to register user.' })
                }

                // creating token and saving in token model
                let token = new Token({
                    token: crypto.randomBytes(16).toString('hex'),
                    userId: user._id
                })
                token = await token.save()
                if (!token) {
                    return res.status(400).json({ error: 'Failed to create token. Please try again' })
                }

                const url = process.env.FRONTEND_URL + `\/email\/confirmation\/` + token.token

                // sending mail 
                sentEmail({
                    from: 'no-reply@web.com',
                    to: user.email,
                    subject: 'Email verification Link',
                    text: `Hello, \n\nTo verify your email by clicking the link below. 
                    \n\nhttp:\/\/${req.headers.host}\/api/confirmation\/${token.token}`,
                    html: `
                        <div className="text-center align-items-center">
                        <h1>Verify your Email Account</h1>
                        <a href='${url}'>Click to Verify</a>
                        <p> ${url} </p>
                        </div>
                    `
                })
                return res.status(200).json({ message: 'Registration successful. Please check your email for confirmation.' })
            }
        })
}

// POST EMAIL CONFIRMATION
exports.postEmailConfirmation = (req, res) => {
    // checking the token valid and matching
    Token.findOne({ token: req.params.token })
        .then(token => {
            if (!token) {
                return res.status(400).json({ error: 'Invalid Token or token has already expired.' })
            }
            // valid token, then checking the valid user for that token
            User.findOne({ _id: token.userId })
                .then(user => {
                    if (!user) {
                        return res.status(400).json({ error: 'Invalid User for this token.' })
                    }
                    // checking if user is already verified or not
                    if (user.isVerified) {
                        return res.status(400).json({ error: 'User is already verified.' })
                    }
                    user.isVerified = true
                    user.save()
                        .then(user => {
                            if (!user) {
                                return res.status(400).json({ error: 'Failed to verify the user.' })
                            }
                            return res.json({ message: 'User has been verified successfully.' })
                        })
                        .catch(err => {
                            return res.status(400).json({ error: err })
                        })
                })
                .catch(err => {
                    return res.status(400).json({ error: err })
                })
        })
        .catch(err => {
            return res.status(400).json({ error: err })
        })
}

// SIGNIN / LOGIN
exports.signIn = async (req, res) => {
    const { email, password } = req.body
    // checking if email is registered or not
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(403).json({ error: 'Email or password is incorrect.' })
    }
    // email found, then checking password
    if (!user.authenticate(password)) {
        return res.status(400).json({ error: 'Email or password is incorrect.' })
    }

    // checking email verified or not
    if (!user.isVerified) {
        return res.status(400).json({ error: 'Email not verified.' })
    }

    // generating token using user id and jwt-secret
    const token = jwt.sign({ _id: user.id, role: user.role }, process.env.JWT_SECRET)

    // saving token in cookie
    res.cookie('myCookie', token, { expire: Date.now() + 99999 }) // 99999 -> is in second

    // returning data to frontend
    const { _id, name, role } = user
    return res.json({ token, user: { _id, name, role, email } })
}

// FORGET PASSWORD
exports.forgetPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(403).json({ error: 'Email not found. Use the email entered in the system.' })
    }
    // creating token and saving in token model
    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        userId: user._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: 'Failed to create token. Please try again' })
    }
    // sending mail 
    sentEmail({
        from: 'no-reply@web.com',
        to: user.email,
        subject: 'Password Reset Link',
        text: `Hello, \n\nTo reset your password please click the link below. 
        \n\nhttp:\/\/${req.headers.host}\/api/resetpassword\/${token.token}`
    })
    return res.json({ message: 'Password reset link has been sent successfully.' })
}

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
    // checking token is valid or not
    const token = await Token.findOne({ token: req.params.token })
    if (!token) {
        return res.status(400).json({ error: 'Invalid Token or Token has expired.' })
    }
    // valid token, then finding valid user for that token
    let user = await User.findOne({ _id: token.userId })
    if (!user) {
        return res.status(400).json({ error: 'User not found' })
    }
    // reseting password
    user.password = req.body.password
    user = await user.save()
    if (!user) {
        return res.status(500).json({ error: 'Failed to reset password.' })
    }

    return res.json({ message: 'Password has been reset successfully.' })
}

// USER LIST
exports.userList = async (req, res) => {
    const user = await User.find()
        .select('-hashed_password') // not showing hashed password and salt
        .select('-salt')
    if (!user) {
        return res.status(400).json({ error: 'Something went wrong.' })
    }

    res.send(user)
}

// USER DETAILS
exports.userDetails = async (req, res) => {
    const user = await User.findOne(req.params._id)
        .select('-hashed_password')
        .select('-salt')
    if (!user) {
        return res.status(400).json({ error: 'Something went wrong.' })
    }

    res.send(user)
}

// // DELETE USER
// exports.deleteUser = async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params._id)
//         if (!user) {
//             return res.status(400).json({ error: 'User not found.' })
//         }
//         res.json({ message: 'User deleted successfully.' })
//     } catch (err) {
//         res.status(500).json({ error: 'Server error.' })
//     }
// }


// // UPDATE USER
exports.updateUser = async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.params._id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    ).select('-hashed_password -salt');

    if (!user) {
        return res.status(400).json({ error: 'User not found or update failed.' });
    }

    res.json(user);
};


// SIGNOUT
exports.signOut = (req, res) => {
    res.clearCookie('myCookie')
    res.json({ message: 'Signout success.' })
}

// REQUIRE SIGNIN
exports.requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: 'auth'
})

// MIDDLEWARE FOR USER ROLE
exports.requireUser = (req, res, next) => {
    // verifying jwt
    expressjwt({
        secret: process.env.JWT_SECRET,
        algorithms: ['HS256'],
        userProperty: 'auth'
    })(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: 'Unauthorized' })
        }
        // checking role of user
        if (req.auth.role === 0) {
            next()
        } else {
            // unauthorized role
            return res.status(403).json({ error: 'Forbidden' })
        }
    })
}

// MIDDLEWARE FOR ADMIN ROLE
exports.requireAdmin = (req, res, next) => {
    // verifying jwt
    expressjwt({
        secret: process.env.JWT_SECRET,
        algorithms: ['HS256'],
        userProperty: 'auth'
    })(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: 'Unauthorized' })
        }
        // checking role of user
        if (req.auth.role === 1) {
            next()
        } else {
            // unauthorized role
            return res.status(403).json({ error: 'Forbidden' })
        }
    })
}

// FOR BOOKMARKING ----------------------------------------------------------------------------------------------------

// BOOKMARKING A BLOG
exports.bookmarkBlog = async (req, res) => {
    const { userId, blogId } = req.params;
    try {
        const user = await User.findById(userId)
        if (!user.bookmarks.includes(blogId)) {
            user.bookmarks.push(blogId);
            await user.save();
        }
        res.status(200).json({ message: 'Blog bookmarked' });
    } catch (err) {
        res.status(500).json({ error: 'Error bookmarking blog' });
    }
}

// GET BOOKMARKED BLOGS
exports.getBookmarkedBlogs = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate('bookmarks')
            .sort({ date: -1 })
        res.status(200).json(user.bookmarks);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
}

// UNBOOKMARKING A BLOG
exports.removeBookmarked = async (req, res) => {
    const { userId, blogId } = req.params;
    try {
        const user = await User.findById(userId);
        // check if the blogId exists in bookmarks
        user.bookmarks = user.bookmarks.filter((id) => id.toString() !== blogId);
        await user.save();
        res.status(200).json({ message: 'Blog removed from bookmarked' });
    } catch (err) {
        res.status(500).json({ error: 'Error removing bookmarked blog' });
    }
}


