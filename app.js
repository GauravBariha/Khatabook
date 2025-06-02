const express = require('express')
const app = express()
const fs = require('fs')

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    fs.readdir(`./hisaab`, ( err, files ) => {
        if(err) return res.status(500).send(files) 
        res.render("index", { files })
    } )
});

app.get('/create', (req, res) => {
    res.render('create')
})

app.get(`/hisaab/:filename`, (req, res) => {
    fs.readFile(`./hisaab/${req.params.filename}`, "utf-8", (err,  filedata) => {
        if(err) return res.status(500).send(err)
        res.render('hisaab', {  filedata, filename: req.params.filename  } )
    })
})

app.get(`/edit/:filename`, (req, res) => {
    fs.readFile(`./hisaab/${req.params.filename}`, "utf-8", (err,  filedata) => {
        if(err) return res.status(500).send(err)
        res.render('edit', {  filedata, filename: req.params.filename  } )
    })
})

app.post('/update/:filename', (req, res) => {
    fs.writeFile(`./hisaab/${req.params.filename}`, req.body.content, (err) => {
       if(err) return res.status(500).send(err) 
        res.redirect("/")
    }) 
})


app.post('/createhisaab', (req, res) => {
    const currentDate = new Date()
    const day = String(currentDate.getDate()).padStart(2, '0') 
    const month = String(currentDate.getMonth()).padStart(2, '0') 
    const year =  currentDate.getFullYear()

    const fn = `${day}-${month}-${year}`
    const fileName = req.body.title && req.body.title.trim() !== "" ? req.body.title : fn 
    
    fs.writeFile(`./hisaab/${fileName}`, req.body.content , (err) => {
        if(err) return res.status(500).send(err)
        res.redirect("/")
    })
})


app.get(`/delete/:title`, (req, res) => {
    const title = req.params.title
    fs.unlink(`./hisaab/${title}`, (err) => {
        if(err) return res.status(500).send(err)
        res.redirect("/")
    })
})



app.listen(3000)