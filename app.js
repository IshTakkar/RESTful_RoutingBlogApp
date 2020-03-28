var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose')
    request = require('request');


//APP CONFIGS
mongoose.connect('mongodb://localhost:27017/restful_blog_app', { useUnifiedTopology: true, useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


//MONGOOSE CONFIGS
var blogSchema = mongoose.Schema({
    name: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", (req, res) => {
    res.redirect("/blogs");
});


app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blog) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { blogs: blog });   
        }
    });
});

app.get("/blogs/new", (req, res) => {
    res.render("new");
});

app.post("/blogs", (req, res) => {
    Blog.create(req.body.blogs, (err, newBlog) => {
        if (err) {
            console.log("Error found");
        } else {
            console.log("New Blog added.");
            console.log(newBlog);
            res.redirect("/blogs");
        }
    });
});


app.listen(3000, () => {
    console.log("Port opened on 3000");
});