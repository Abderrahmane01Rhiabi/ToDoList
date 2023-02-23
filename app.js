const express = require("express");
const bodyParser = require("body-parser");

let items = ["Buy Food","Cook Food","Ear Food"]; //scoop
let workItems = [];

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static("public"));

app.get("/",(req,res)=>{

    let today = new Date();

    let options = { 
            weekday : "long",
            day : "numeric",
            month : "long"
        }

    let currentDay = today.toLocaleDateString("fr-FR", options);


    res.render("list", {
        currentTitle : currentDay,
        newListItems : items
    })

})

app.post("/",(req,res) =>{
    let item = req.body.newItem;

    console.log(req.body);

    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work");
    }else{
        items.push(item);
        res.redirect("/");
    }
})

app.get("/work",(req,res) =>{

    res.render("list", {
        currentTitle : "Work list",
        newListItems : workItems
    })
})

app.listen(3000, ()=>{
    console.log("server running on port 3000");
})