const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

mongoose.set({});
mongoose.connect("mongodb+srv://rhiabi:rhiabi@rh.2aapw.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = {
    name: String
}

//mongose model : capitalize name
const Item = mongoose.model("Item", itemsSchema); //create Items collection

const item1 = new Item({ name: "Hi, welcome to your ToDoList" });
const item2 = new Item({ name: "Hit the + butoon to add a new item" });
const item3 = new Item({ name: "<- Hit this to delete an item" });

const defaultItems = [item1, item2, item3]

const listsSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listsSchema);


//for root /
app.get("/", (req, res) => {


    Item.find({}).then((docs) => {

        if (docs.length === 0) {
            //add default items
            Item.insertMany(defaultItems).then(() => {
                console.log("default items added succesfuly");
            }).catch((err) => {
                console.log(err);
            })
            res.redirect("/");
        } else {

            const currentDay = date.getDate();

            res.render("list", {
                currentTitle: currentDay,
                newListItems: docs
            })
        }

    }).catch((err) => {
        console.log(err);
    })



})

app.get("/:customListName", (req, res) => {
    const customListName = req.params.customListName;

    List.findOne({ name: customListName }).then((docs) => {

        if (docs) {
            console.log(customListName + " list already existe");

            console.log(docs);

            res.render("list", {
                currentTitle: docs.name,
                newListItems: docs.items
            })

        } else {
            console.log(customListName + " default items added succesfuly");

            const list = new List({
                name: customListName,
                items: defaultItems
            })

            /*In this code, you are creating a new document and 
            saving it to the database using list.save(). However, you are not waiting for the list.save() method to complete 
            before redirecting the user to the newly created list using res.redirect(). 
            This can result in the user being redirected to the list page before the new document is saved to the database.

            To fix this issue, you should use the list.save().then() syntax to wait 
            for the list.save() method to complete before redirecting the user. Here's the updated code:
            

            
            This code creates a new document and saves it to the database using list.save(). 
            Then, it waits for the list.save() method to complete using .then(). If the list.save() 
            method completes successfully, the code logs 
            a success message to the console and redirects the user to the newly created list using res.redirect(). 
            If there is an error during the list.save() method, the error is logged to the console using .catch().*/

            list.save().then((result) => {
                //console.log("----1----");
                //console.log(result);
                //console.log("----2----");

                res.redirect("/" + customListName)
            }).catch((err) => {
                console.log(err);
            });

        }

    }).catch((err) => {
        console.log(err);
    })
})


app.post("/", (req, res) => {

    const listName = req.body.list;

    const itemName = req.body.newItem;
    console.log("listName : " + listName);
    const newItem = new Item({
        name: itemName
    })

    //Take the firts part of date 
    let currentDay = date.getDate();
    const day_1 = currentDay.split(" ");

    //check if the first part of my date equal to the listName
    if (listName === day_1[0]) {
        newItem.save().then(() =>{
            res.redirect("/");
        }).catch((err) =>{
            console.log(err);
        });
    } else {

        /*To add a new item to the items array and update the document in the database, 
        you can use the $push operator in your update query */
        List.updateOne({ name: listName }, { $push: { items: newItem } }).then(() => {
            console.log("updated succesfuly");
            res.redirect("/" + listName);
        }).catch((err) => {
            console.log(err);
        })
    }



})

app.post("/delete", (req, res) => {

    const itemToBeDeleted = req.body.ItemToBeDeleted
    const listName = req.body.listName;

    //Take the firts part of date 
    let currentDay = date.getDate();
    const day_1 = currentDay.split(" ");


    //check if the first part of my date equal to the listName
    if (listName === day_1[0]) {

        Item.deleteOne({ _id: itemToBeDeleted }).then((docs) => {
            console.log(docs);
            res.redirect("/");
        }).catch((err) => {
            console.log(err);
        });
    

    } else {
                                                    //field : {id : value}
        List.updateOne({ name: listName }, { $pull: { items: { _id: itemToBeDeleted } } }).then((docs) => {
            console.log("deleted succesfuly");
            console.log(docs);

            res.redirect("/" + listName);
        }).catch((err) => {
            console.log(err);
        })

    }


})


app.get("/about", (req, res) => {
    res.render("about")
})


app.listen(3000, () => {
    console.log("server running on port 3000");
})


/* 
    The reason why the list name and URL are automatically converted to lower case characters 
    in your project could be due to the implementation of the server-side framework or libraries used in your project. 
    Some frameworks, such as Express, have default behavior that automatically converts 
    incoming request URLs and parameters to lower case. 

app.post("/", (req, res) => {

app.get("/:customListName", (req, res) => {

    //to solve this probleme before -> we have to add loadash
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName }).then((docs) => {

        if (docs) {
            console.log(customListName + " list already existe");

            console.log(docs);

            res.render("list", {
                currentTitle: docs.name,
                newListItems: docs.items
            })

        } else {
            console.log(customListName + " default items added succesfuly");

            const list = new List({
                name: customListName,
                items: defaultItems
            })

            list.save().then((result) => {
                res.redirect("/" + customListName)
            }).catch((err) => {
                console.log(err);
            });

        }

    }).catch((err) => {
        console.log(err);
    })
})

*/