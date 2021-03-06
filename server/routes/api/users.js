const express =  require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt= require('bcryptjs');
const jwt = require('jsonwebtoken');
//load user model
const User =require('../../models/User');

const keys = require('../../config/keys');

//@route get api/users/test
//@desc test users
//@access public

router.get('/test',(req,res) => res.json({msg:'users work'}));

//@route get api/users/register
//@desc register users
//@access public

router.post('/register',(req,res)=>{
    User.findOne({ email: req.body.email })
    .then(user =>{
        if(user){
            return res.status(400).json({email: 'Email already exists'});
        }
        else{
            const avatar = gravatar.url(req.body.email,{
                s: '200',//size
                r: 'pg',//rating
                d: 'mm'//default
            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar: avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err,salt)=>{
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err) throw err;
                    newUser.password= hash;
                    newUser.save()
                    .then(user=> res.json(user))
                    .catch(err => console.log(err));
                })
            })
        }
    })
});


//@route get api/users/login
//@desc login user / returning JWT token
//@access public
router.post('/login', (req,res)=>{
    const email= req.body.email;
    const password= req.body.password;

    //find the user by email 
    User.findOne({email})
    .then(user => {
        //check for user
        if (!user){
            return res.status(4040).json({email: 'user not found'});
        }
        //check password
        bcrypt.compare(password, user.password)
        .then(isMatch => {
            if(isMatch){
            // User matched 
                const payload = { id: user.id, name: user.name, avatar: user.avatar } //create jwt payload

            //sign token 
            jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600},
                (err,token)=>{
                    res.json({
                        success: true,
                        token: 'Bearer' + token
                    });

            });
            }
            else{
                return res.status(400).json({password: 'password incorrect'});
            }
        })
    });
});

module.exports = router;
