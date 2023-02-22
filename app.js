const express = require("express");
const bodyParser = require("body-parser");

var items = ["Buy Food","Cook Food","Ear Food"]; //scoop

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static("public"));

app.get("/",(req,res)=>{

var today = new Date();

var options = { 
    weekday : "long",
    day : "numeric",
    month : "long"
}

const currentDay = today.toLocaleDateString("fr-FR", options);


    res.render("list", {
        todayText : currentDay,
        newListItems : items
    })

})

app.post("/",(req,res) =>{
    const item = req.body.newItem;

    items.push(item);

    res.redirect("/");

})

app.listen(3000, ()=>{
    console.log("server running on port 3000");
})