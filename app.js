const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname+"/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static("public"));

mongoose.set({});
mongoose.connect("mongodb://127.0.0.1:27017/todolistDb");

const itemsSchema = {
    name : String
}

//mongose model : capitalize name
const Item = mongoose.model("Item",itemsSchema); //create Items collection

const item1 = new Item({ name : "Hi, welcome to your ToDoList"});
const item2 = new Item({ name : "Hit the + butoon to add a new item"});
const item3 = new Item({ name : "<- Hit this to delete an item"});

const defaultItems = [item1, item2, item3]


app.get("/",(req,res)=>{


    Item.find({}).then((docs) =>{

        if(docs.length === 0){
            //add default items
            Item.insertMany(defaultItems).then(()=>{
                console.log("default items added succesfuly");
            }).catch((error) =>{
                console.log(error);
            })
            res.redirect("/");
        }else{

            const currentDay = date.getDate();

            res.render("list", {
                currentTitle : currentDay,
                newListItems : docs
            })
        }

    }).catch((err) =>{
        console.log(err);
    })



})

app.post("/",(req,res) =>{
    const itemName = req.body.newItem;

    const itemDoc = new Item({name : itemName})

    itemDoc.save()

    res.redirect("/");

})

app.post("/delete", (req,res) =>{

    const itemToBeDeleted = req.body.ItemToBeDeleted

    Item.deleteOne({_id : itemToBeDeleted}).then((docs) =>{
        console.log(docs);
    }).catch((err) =>{
        console.log(err);
    });

    res.redirect("/");

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