const express = require("express");
const path = require("path");
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/contactDance', {useNewUrlParser: true, useUnifiedTopology: true});
const port = 80;
const bodyparser=require("body-parser");
var validator=require('validator');

// define mongoose schema 
const contactSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:3
    },
    phone:{
        type:Number,
        required:true,
        min:10
     },
    email: {
        
     type:String,
     required:true,
     validate(value){
         if(!validator.isEmail(value)){
             throw new Error("Invalid email id")
         }
     }
},
    address: String,
    desc: String,
    
    date:{
        type:Date,
        default:Date.now
    }
  });

  const Contact = mongoose.model('contact', contactSchema);



// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded({extended:false}));

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory
 
// ENDPOINTS
app.get('/', (req, res)=>{
    
    res.status(200).render('home.pug');
})

app.get('/contact', (req, res)=>{
   res.status(200).render('contact');
})
// using express post request for save in database so install npm install body-parser 
app.post('/contact', (req, res)=>{
    var myData=new Contact(req.body);
    myData.save().then(()=>{
        res.status(201).render("home")
    }).catch((error)=>{
        res.status(500).send(error)
    })
    // res.status(200).render('contact.pug');
 })

// START THE SERVER
app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
});
