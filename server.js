var fs = require("fs")
var path = require('path')
var express = require('express')
var Handlebars = require('handlebars')
var exphbs = require ('express-handlebars')

var app = express()
var port = process.env.PORT || 3000

app.engine("handlebars", exphbs.engine({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.static(__dirname + '/static'))

app.get('/', function(req, res, next){
    res.status(200).render('home')
})

app.get('*', function(req, res, next){
    res.status(404).render('404', {
        page: req.url
    })
})

app.listen(port, function () {
    console.log("== Server listening on port", port)
  })