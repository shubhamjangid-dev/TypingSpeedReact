import express from "express";
import connectDB from "./db/index.js"
import {app} from "./app.js"
import dotenv from "dotenv";
dotenv.config({
    path :'./.env'
})

connectDB() // connect to database

.then(()=>{
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`App is running at PORT : ${process.env.PORT}` );
    })
})
.catch((error)=>{
    console.log("ERROR MONGODB CONNECTION FAILED : ", error);
})




// ek bbat ratlo database dusre continent me h to time lgta
// error bhi bahut aati h
// to hamesha try catch or async await ka use krna

// IIFE 
// ( async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error", (error)=>{
//             console.log("ERRORR",error);
//             throw error;
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`app is listening on ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.log("ERROR",error);
//     }
// })()