const express = require("express");
const app = express();
// Use session middleware

//midelwars
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));
// app.use(session({
//     secret: 'your-secret-key',
//     resave: false,
//     saveUninitialized: true,
//   }));
// set the ejs : set the view engine
app.set("view engine" , "ejs");

//main route
const routes = require("./server/routes/route.js");
app.use("/" ,routes);
// lunch the app at the port 8080
app.listen(8080,(err)=>{
    if(err){
        console.log("err");
    }else{
        console.log("server lunched at port 8080");
    }
})