const express = require('express');
const bodyParser = require("body-parser");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let items = ["Buy Book", "Drink Coffee", "Drink beer"];
let workItems = [];

//GET Home page
app.get("/", function(req, res){
    const date = new Date();
    const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
    };
    let currentDay = date.toLocaleDateString("vi", options);
    res.render("list", {listTitle: currentDay, newListItem: items});
});

//GET Work page
app.get("/work", function(req, res) { 
    res.render("list", {listTitle: "Work list", newListItem: workItems});
 });

 app.get("/about", function(req, res) {
    res.render("about");
 });
//POST Home Page
app.post("/", function(req, res){
    let item = req.body.newItem;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");        
    } else {
        items.push(item);
        res.redirect("/");
    }

});


app.listen(3000, function(){
    console.log("Server running on port 3000");
});