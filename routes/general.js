const app = require('express')
const prisma = require('../model.js')
var bodyParser = require('body-parser');

const router = app.Router();
//adding middle wares
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true })); 


router.post("/project", async (req, res)=>{
/*
    values expected
    {
        "uid" : "537b154e-2102-4eff-ba8e-2282e3db5d0d",
        "name" : "paul",
        "description" : "vhbchbxcvchvxhbvcx",
        "file" : "vhjvzfhvjhzbvfzhjvbzjhv",
        "snippet" : "hvdahVDh",
        "genre" : "rap",
        "colaborate" : false,
        "proposal" : "dhvfhhbvfhbfh"
    }
    */
    const { uid , name, file,description, proposal, genre, snippet, colaborate  } = req.body;
    try {
        var project = await prisma.project.create({
            data :{
                name : name,
                description : description,
                file : file,
                snippet : snippet,
                genre : genre,
                colaborate : colaborate,
                proposal : proposal,
                author : { connect : { uid : uid }},
            } 
        })
        res.status(200).json({"message" : project})
    } catch (error){
        console.log(error)
        res.status(200).json({"message" : "error occoured verify that you filled all fields uid , name, file,description, proposal, genre, snippet, collaboration  "})
    }
})

router.get("/project", async (req, res)=>{
    var data = await prisma.project.findMany()
    if (data == null){
        res.status(200).json({"message" : []})
    } else {
        res.status(200).json({"message" : data})
    } 
}) 

router.get("/project/:id", async (req, res)=>{
    /*
    returns (all optional)
    {
        "uid" : "537b154e-2102-4eff-ba8e-2282e3db5d0d",
        "name" : "paul",
        "description" : "vhbchbxcvchvxhbvcx",
        "file" : "vhjvzfhvjhzbvfzhjvbzjhv",
        "snippet" : "hvdahVDh",
        "genre" : "rap",
        "colaborate" : false,
        "proposal" : "dhvfhhbvfhbfh"
    }
    */
    var id = req.params.id
    var data = await prisma.project.findFirst({
        where : {
            id : id
        }
    })
    if (data == null){
        res.status(200).json({"message" : []})
    } else {
        res.status(200).json({"message" : data})
    } 
}) 

router.put("/project/:id", async (req, res)=>{
    /*
    valuse expected (all optional)
    {
        "uid" : "537b154e-2102-4eff-ba8e-2282e3db5d0d",
        "name" : "paul",
        "description" : "vhbchbxcvchvxhbvcx",
        "file" : "vhjvzfhvjhzbvfzhjvbzjhv",
        "snippet" : "hvdahVDh",
        "genre" : "rap",
        "colaborate" : false,
        "proposal" : "dhvfhhbvfhbfh"
    }
    */
    try {
        var uid = req.body["uid"]
        delete req.body["uid"]
        req.body.author = { connect : { uid : uid }}
        var id = req.params.id
        var project = await prisma.project.update({
            where : {
                id : parseInt(id)
            },
            data : req.body
        })

        res.status(200).json({"message" : project})
    } catch (error) {
        console.log(error)
        res.status(200).json({"message" : "error occoured while making update"})
    }
}) 

router.delete('/project/:id/:uid', async (req, res) => {
    const { id } = req.params
    const  { uid } = req.params

    var user = await prisma.user.findFirst({
        where : {
            uid : uid
        }
    })
    console.log(user)
    if (user == null || user.length == 0){
        res.status(200).json({"message" : "project not found or you do not have permission to delete the project"})
    } else {
        const data = await prisma.project.delete({
            where: {
              id : parseInt(id) ,
            },
          })
        res.status(200).json({"message" : data})
    }
    res.json(user)
  })

module.exports = router;