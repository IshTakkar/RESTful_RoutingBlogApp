var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    request = require('request'),
    expressSanitizer = require('express-sanitizer');


//APP CONFIGS
mongoose.connect('mongodb://localhost:27017/restful_blog_app', { useUnifiedTopology: true, useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));


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

app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            console.log("found error");
        } else {
            res.render("show", { blog: foundBlog });
        }
    });
});

app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            console.log("Error found.");
        } else {
            res.render("edits", { blog: foundBlog });
        }
    });
});


app.put("/blogs/:id", (req, res) => {
    req.body.blogs.body = req.sanitize(req.body.blogs.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blogs, (err, updatedBlog) => {
        if (err) {
            console.log("Error found");
        } else{
            res.redirect("/blogs/" + req.params.id);
       }
    });
});

app.delete("/blogs/:id", (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err, deletedBlog) => {
        if (err) {
            console.log("Error found");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.listen(3000, () => {
    console.log("Port opened on 3000");
});