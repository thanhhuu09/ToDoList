const express = require("express");
const bodyParser = require("body-parser");

const app = express();
var listItems = [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function(req, res){
    var today = new Date();
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    var currentDay = today.toLocaleDateString("en-US", options);
    res.render("list", {kindOfDay:currentDay, item:listItems});
});

app.post("/", function(req, res){
    var item = req.body.newItem;
    listItems.push(item);
    res.redirect("/");
});
app.listen(3000, function(){
    console.log("Server start on port 3000");
});