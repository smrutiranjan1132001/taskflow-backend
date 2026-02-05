// src/app.js
const express = require('express')
const taskRoutes = require("./routes/task.routes")

app = express()

//Using middleware for JSON
app.use(express.json())

app.use("/api/v1/tasks",taskRoutes)

app.get("/health",(req,res) => {
    res.status(200).json({status : "OK"})
})

app.get("/async-demo",async (req,res,next) =>{
    try{
        await new Promise((resolve) => setTimeout(resolve,1000));
        res.json({message : "Async Worked"})

    }catch(err){
        next(err);
    }
});

app.get("/error-demo",async(req,res,next) => {
    throw new Error("Something is Broke.")
})

// ❗ Global error handler (MUST be last)
app.use((err,req,res,next) => {
    console.log(err);

    res.status(500).json({
        error : "Internal Server Error"
    })
})
//--Anything bad happens to the server this get called automatically rather than crashing
module.exports = app