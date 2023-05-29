// imports
const express = require('express')
const app = express()
const port = 3000



//Static files
app.use(express.static('public'))
app.use('/css',express.static(__dirname + 'public/css'))
app.use('/js',express.static(__dirname + 'public/js'))
app.use('/img',express.static(__dirname + 'public/img'))
app.use('/swiper',express.static(__dirname + 'public/swiper'))
app.use('/glightbox',express.static(__dirname + 'public/glightbox'))
app.use('/bootstrap',express.static(__dirname + 'public/bootstrap'))
app.use('/aos',express.static(__dirname + 'public/aos'))
app.use('/purecounter',express.static(__dirname + 'public/purecounter'))


//Set views

app.set('views', './views')
app.set('view engine','ejs')

app.get('',(req,res)=>{
    res.render('home',{text:'Explore my services and discover, how I can help you achieve your goals.'})
})

app.get('/aboutme',(req,res)=>{
    res.render('aboutme')
})
app.get('/contactme',(req,res)=>{
    res.render('contactme')
})
app.get('/home',(req,res)=>{
    res.render('home',{text:'Explore our services and discover how we can help you achieve your goals.'})
})
app.get('/project',(req,res)=>{
    res.render('project')
})
app.get('/service',(req,res)=>{
    res.render('service')
})


//Listen on port 3000
app.listen(port,() => console.info('listening on port' + port))