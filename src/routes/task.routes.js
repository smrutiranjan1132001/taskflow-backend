const express = require('express')
const router = express.Router()

// POST api/v1/task
router.post('/',async(req,res) => {
    res.status(201).json({
        message : "Task Created"
    })

})

//GET api/v1/task
router.get('/',async(req,res) =>{
    res.json({
        tasks : ["Land Lele"]
    })
})

//GET(id) api/v1/task/:id
router.get('/:id',async(req,res) => {
    res.json({
        taskID : req.params.id
    })
})

module.exports = router