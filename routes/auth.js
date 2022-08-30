const app = require('express')
const prisma = require('../model.js')
var bodyParser = require('body-parser');
const  { randomUUID }  = require('crypto')


const router = app.Router();
// adding middle wares
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true })); 




router.post("/login",async (req, res)=>{
    // console.log(randomUUID())
    const { email , password } = req.body
    var post = await prisma.user.findFirst({
        where : {
            email : email,
            password : password
        }
    })
    if (post == null){
        res.status(200).json({"message" : "no user found"})
    } else {
        res.status(200).json({"message" : post})
    }
    
})
router.post("/signup",async (req, res)=>{
    const { email , password, username } = req.body
    const uid = randomUUID();
    try {
            var post = await prisma.user.create({
            data : {
                email : email,
                password : password,
                uid : uid,
                name : username 
            }
        })
        res.status(200).json({"message" : post})
    } catch (error) {
        res.status(200).json({"message" : "no user found"})
    }
})

module.exports = router;