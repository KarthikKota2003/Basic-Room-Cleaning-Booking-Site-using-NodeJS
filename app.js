const express = require("express")
const mongoose = require("mongoose")
const path = require('path');

const tempPath = path.join(__dirname,'views');

const app = express()
mongoose.connect("mongodb://127.0.0.1:27017/DBMSProj")

// app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views',tempPath);

app.use("/static", express.static("static"))
app.use(express.urlencoded({extended:false}))



const User = mongoose.model('Users', {
    'regno': Number,
    'name': String,
    'roomno': Number,
    'hostel_name': String,
    'room_type': String,
    'floor': Number,
    'ndate': String,
    'carea': String
})
 
 

app.post("/signup",async(req,res) => {
    try {
        const user = new User(req.body)
    await user.save()
        .then(() => {
            console.log("Successful")
            res.render('home',{record : user});
        })
        .catch(() => {
            res.send("Error")
        })
    } catch (error) {
       console.log(error); 
    }
            
})

app.post("/login", (req,res) => {
    User.findOne({"regno":req.body.regno}).exec()
        .then((user) => {
            if (user.name === req.body.name) {
                console.log("Successful")
                res.render('home',{record : user});
            } else {
                res.send("Password wrong")
            }
        })
        .catch((err) => {
            res.send("User not found or internal error")
        })
})

app.post("/book",(req,res) =>{ 
    const regno = req.body.regno;
    const carea = req.body.carea;
    const ndate = req.body.ndate;

     User.updateOne(
      { regno: regno },
      { carea: carea, ndate: ndate },
      { new: true }
    )
  .then(updatedDocument => {
    console.log(updatedDocument);

    


    // res.render('home',{doc : updatedDocument});
  })
  .catch(error => {
    console.log(error);
    res.status(500).send("Error occurred while updating document.");
  }); 
  
  User.findOne({"regno": regno}).exec()
        .then((user) => {
                res.render('home',{record : user});
        })
        .catch((err) => {
            res.send("User not found or internal error")
        })
})

app.listen(8000, () => {
    console.log("backend running on port 8000")
})