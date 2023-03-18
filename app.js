const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
  .connect(
    "mongodb+srv://tommythach:huu123@cluster0.qhkbcp1.mongodb.net/todolistDB?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to database successfully."))
  .catch((err) => console.log(err));

const itemSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemSchema);

const item_first = new Item({
  name: "Take the dog for a walk",
});

const item_second = new Item({
  name: "Book a dentist appointment",
});

const item_third = new Item({
  name: "Clean the house",
});

const defaultItems = [item_first, item_second, item_third];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema],
});

const List = mongoose.model("List", listSchema);
//GET Home page

app.get("/", function (req, res) {
  Item.find({})
    .then((items) => {
      if (items.length === 0) {
        Item.insertMany(defaultItems)
          .then(() => console.log("Insert many items successfully."))
          .catch((err) => console.log(err));
        res.redirect("/");
      } else {
        res.render("list", { listTitle: "Today", newListItem: items });
      }
    })
    .catch((err) => console.log(err));
});

//GET Work page
app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({
    name: customListName,
  })
    .then((foundList) => {
      if (foundList) {
        res.render("list", {
          listTitle: foundList.name,
          newListItem: foundList.items,
        });
      } else {
        //Tạo list mới
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      }
    })
    .catch((err) => console.log(err));
});
app.get("/about", function (req, res) {
  res.render("about");
});
//POST Home Page
app.post("/", function (req, res) {
  const list_name = req.body.list;
  const item_name = req.body.newItem;
  const item = new Item({
    name: item_name,
  });

  if (list_name === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: list_name })
      .then((foundList) => {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + list_name);
      })
      .catch((err) => console.log(err));
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId)
      .then(() => {
        console.log("Remove item successfully");
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } }
    )
      .then(() => {
        res.redirect("/" + listName);
      })
      .catch((err) => console.log(err));
  }
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});
