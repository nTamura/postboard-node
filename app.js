const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongojs = require('mongojs');
const db = mongojs('postboard', ['users']);

const app = express();

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// bodyParser MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static path
app.use(express.static(path.join(__dirname, 'public')));

// global vars
app.use(function(req,res,next){
  res.locals.errors = null;
  next();
})

// express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg: msg,
      value: value
    };
  }
}));

// app is getting a view get requiest
app.get('/', function(req, res){
  db.users.find(function(err, docs){
    console.log(docs);
    res.render('index', {
      title: 'PostBoard',
      users: docs
    });
  })
})

app.post('/users/add', function(req, res){
  req.checkBody('userName', 'Name is required').notEmpty();
  req.checkBody('msg', 'Message cannot be empty').notEmpty();
  const errors = req.validationErrors();

  if(errors){
    res.render('index', {
      title: 'PostBoard',
      users: users,
      errors: errors
    });
  } else {
    let newUser = {
      userName: req.body.userName,
      msg: req.body.msg
    }
    console.log('Message successfully posted!')
    console.log(req.body.msg)

    db.users.insert(newUser, function(err, result){
      if(err){
        console.log(err)
      }
      res.redirect('/');
    });
  };
});

app.listen(8000, function(){
  console.log('server started on port 8000')
});
