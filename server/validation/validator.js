const { check, validationResult } = require('express-validator')

exports.validation=(req,res,next)=>{
    const errors = validationResult(req)
    if(errors.isEmpty()){
        next()
    }
    else{
        return res.status(400).json({error : errors.array()[0].msg})
    }
}


// USER VALIDATION 
exports.userValidation = [
    check('name', 'name is required').notEmpty()
    .isLength({min:3}).withMessage('name must be at leat 3 characters.'),

    check('email', 'email is required').notEmpty()
    .isEmail().withMessage('Invalid email.'),
    
]

// PASSWORD VALIDATION
exports.passwordValidation=[
    check('password','password is required').notEmpty()
    // .matches(/[a-z]/).withMessage('Password must contain at least one lower case alphabet.')
    // .matches(/[A-Z]/).withMessage('Password must contain at least one upper case alphabet.')
    // .matches(/[0-9]/).withMessage('Password must contain at least one number.')
    // .matches(/[#$@_&?]/).withMessage('Password must contain at least one special character.')
    // .isLength({min:5}).withMessage('Password must be at least 8 characters.')
]