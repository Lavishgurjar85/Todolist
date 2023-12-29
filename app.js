//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
// const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-lavish:Lavish123@atlascluster.ikwykey.mongodb.net/todolistdb");

const itemsSchema=new mongoose.Schema({
  name:String
});

const Item =mongoose.model("Item",itemsSchema);

const item1=new Item({
  name:"Welcome to todo list"
})

const item2=new Item({
  name:"hit + to add new item"
})

const item3=new Item({
  name:"-- hit to delete an item"
})

const defaultItems=[item1,item2,item3];



const ListSchema=new mongoose.Schema({
  name:String,
  items:[itemsSchema]
})

const List=mongoose.model("List",ListSchema);




app.get("/", function(req, res) {

// const day = date.getDate();

Item.find().then(function(itemss){

 if(itemss.length==0)
 {
  Item.insertMany(defaultItems).then(function()
{
  console.log("success");
});
 }

  res.render("list", {listTitle: "Today", newListItems: itemss});
});

 
app.get("/:listType", function(req,res){
  const listType=req.params.listType;

  List.findOne({name:listType}).then(function(foundlist){
    if(!foundlist)
    {const list=new List({
      name:listType,
      items:defaultItems
    })
  
    list.save("/"+listType);
    res.redirect
  }
  else
  res.render("list", {listTitle: foundlist.name, newListItems: foundlist.items});


  });

});




});

app.post("/", function(req, res){

  const itemname = req.body.newItem;
  const listName= req.body.list;
  
  const newitem = new Item({
    name:itemname
  })


  if(listName==="Today")
  {
    newitem.save().then(function(){
      console.log("Success");
    })
  res.redirect("/");
  }
  else{
    List.findOne({name:listName}).then(function(foundlist){
      foundlist.items.push(newitem);
      foundlist.save();
      res.redirect("/"+listName)
    })
  }


});







app.post("/delete/",function(req,res){
  const checkboxid=req.body.checkbox;
  const listName= req.body.list;
  if(listName==="Today")
{
  Item.deleteOne({_id:checkboxid}).then(function(){console.log("successfully deleted")});
  res.redirect("/");
}
else{
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkboxid}}}).then(function(foundlist){
  res.redirect("/"+listName)
  })
}

  
})






app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
