//=========================================================================
//Student
//=========================================================================
/**
 * Name: Yeshi Ngawang
 * Id: 301302902
 */
//=======================================================
//imports
//=======================================================
const express = require('express')
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const LocalStrategy = require("passport-local")
const passportLocalMongoose =  require("passport-local-mongoose")
const User = require("./model/User");

//===========================================
//Static files
//===========================================
app.use(express.static('public'))
app.use('/css',express.static(__dirname + 'public/css'))
app.use('/js',express.static(__dirname + 'public/js'))
app.use('/img',express.static(__dirname + 'public/img'))
app.use('/swiper',express.static(__dirname + 'public/swiper'))
app.use('/glightbox',express.static(__dirname + 'public/glightbox'))
app.use('/bootstrap',express.static(__dirname + 'public/bootstrap'))
app.use('/aos',express.static(__dirname + 'public/aos'))
app.use('/purecounter',express.static(__dirname + 'public/purecounter'))

//=========================================================
//Setting views and view engine
//=========================================================
app.set('views', './views')
app.set('view engine','ejs')

//========================================================
// ROUTES
//========================================================
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
    res.render('home',{text:'Explore the services provided and discover how we can help you achieve your goals.'})
})
app.get('/project',(req,res)=>{
    res.render('project')
})
app.get('/service',(req,res)=>{
    res.render('service')
})
app.get('/login',(req,res)=>{
    res.render('login')
})

//==============================================
//Database Connections
//==============================================
mongoose.connect('mongodb+srv://yngawang:qwertykey@cluster0.3xqyrba.mongodb.net/Assignment2', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

//========================================================
//Authentications
//========================================================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));

const passport = require("passport")

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/connections', isLoggedIn, function (req, res) {
  res.render('connections');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

//==================================================
//Handling user login
//==================================================
app.post("/login", async function (req, res) {
    try {
      // check if the user exists
      const user = await User.findOne({ username: req.body.username });
      if (user) {
        // check if password matches
        const result = req.body.password === user.password;
        if (result) {
          res.redirect("contact");
        } else {
          res.send('<script>alert("Password doesn\'t match"); window.history.back();</script>');
        }
      } else {
        res.send('<script>alert("User doesn\'t exist"); window.history.back();</script>');
      }
    } catch (error) {
      res.send(`<script>alert("${error.message}"); window.history.back();</script>`);
    }
  });

//=====================================================================
//Handeling connections
//=====================================================================

const contactSchema ={
  name: String,
  phonenumber: String,
  email: String
}

const Contact = mongoose.model('Contacts',contactSchema);

app.get('/contact', async (req, res) => {
  try {
    const contacts = await Contact.find({});
    res.render('contact', { contacts: contacts });
  } catch (err) {
    console.error('Error retrieving contacts:', err);
    res.status(500).send('Internal Server Error');
  }
});

//=======================================================
//Handel updates
//=======================================================

app.get("/update/:id", function (req, res) {
  const contactId = req.params.id;
  res.render("update", { contactId });
});

app.post('/update/:id', (req, res) => {
  const contactId = req.params.id;

  const updatedContact = {
    name: req.body.name,
    phonenumber: req.body.number,
    email: req.body.email
  };

  Contact.findOneAndUpdate(
    { _id: contactId },
    { $set: updatedContact },
    { new: true }
  )
    .then(updatedContact => {
      res.redirect('/contact');
    })
    .catch(error => {
      console.error('Error updating contact:', error);
      res.status(500).json({ error: 'Failed to update the contact' });
    });
});

// app.get('/js/update.js', (req, res) => {
//   res.sendFile(__dirname + '/update.js');
// });

//=============================================================================
//Handle delete
//=============================================================================

app.delete('/delete/:id', (req, res) => {
  const contactId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(400).send('Invalid contact ID');
  }

  Contact.findOneAndRemove({ _id: contactId })
    .then((deletedContact) => {
      if (!deletedContact) {
        return res.status(404).send('Contact not found');
      }
      res.sendStatus(204); // No content (successful deletion)
    })
    .catch((err) => {
      console.error('Error deleting contact:', err);
      res.status(500).send('Error deleting contact');
    });
});

//=======================================================
//Listen on deployent environment port or 80
//=======================================================
//app.listen(port,() => console.info('listening on port' + port))
app.listen(process.env.PORT || 80)