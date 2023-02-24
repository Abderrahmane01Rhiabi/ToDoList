const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js")


const items = ["Buy Food","Cook Food","Ear Food"]; //scoop
const workItems = [];

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static("public"));

app.get("/",(req,res)=>{

    
    const currentDay = date.getDate();

    res.render("list", {
        currentTitle : currentDay,
        newListItems : items
    })

})

app.post("/",(req,res) =>{
    const item = req.body.newItem;

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

app.get("/about", (req,res) =>{
    res.render("about")
})

app.listen(3000, ()=>{
    console.log("server running on port 3000");
})