const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const Message = require('./models/message');
const User = require('./models/user');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const checkAuth = require('./middleware/check-auth');

const app = express();

app.use(bodyParser.json());
app.use("/images", express.static(path.join("images")));
app.use("/avatars", express.static(path.join("avatars")));


const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});


mongoose.connect("mongodb+srv://Alex:g0YgFCoDFEbgHitH@cluster0.rtql1.mongodb.net/ChatDatabase?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/users/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ username: req.body.username })
    .then(user => {
      if (!user) {
        return res.status(404).json({
          alert: "Login failed"
        });
      }
      fetchedUser = user;
      if (req.body.password != user.password) {
        return res.status(404).json({
          alert: "Login failed"
        });
      }
      else {
        const token = jwt.sign(
          { username: fetchedUser.username, fetchedUserId: fetchedUser._id },
          'secret_this_should_be_longer',
          { expiresIn: "1h" });
        res.status(200).json({
          token: token,
          userId: fetchedUser._id
        });
      }
    });
});

app.get("/api/users/:id", (req, res, next) => {
  User.findById(req.params.id).then(user => {
    if (user) {
      res.status(200).json(user);
    } else {

      res.status(404).json({ message: "User not found!" });
    }
  });
});

app.post("/api/messages", checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  if (req.file) {
    const message = new Message({
      userId: req.body.userId,
      content: req.body.content,
      time: req.body.time,
      read: req.body.read,
      imagePath: url + "/images/" + req.file.filename,
    });
    console.log(message);
    message.save().then(createdMessage => {
      res.status(201).json({
        alert: 'Message added successfully',
        message: {
          id: createdMessage._id,
          userId: createdMessage.userId,
          content: createdMessage.content,
          time: createdMessage.time,
          read: createdMessage.read,
          imagePath: createdMessage.imagePath
        }
      });
    });
  }
  else {
    const message = new Message({
      userId: req.body.userId,
      content: req.body.content,
      time: req.body.time,
      read: req.body.read,
      imagePath: '',
    });
    console.log(message);
    message.save().then(createdMessage => {
      res.status(201).json({
        alert: 'Message added successfully',
        message: {
          id: createdMessage._id,
          userId: createdMessage.userId,
          content: createdMessage.content,
          time: createdMessage.time,
          read: createdMessage.read,
          imagePath: createdMessage.imagePath
        }
      });
    });
  }

});

app.get('/api/messages', (req, res, next) => {
  Message.find()
    .then(documents => {
      res.status(200).json({
        alert: 'Messages fetched successfully!',
        messages: documents
      });
    });
});

app.put( "/api/messages/:id", (req, res, next) => {
    const message = new Message({
      _id: req.body.id,
      userId: req.body.userId,
      content: req.body.content,
      time: req.body.time,
      read: req.body.read,
      imagePath: req.body.imagePath
    });
    Message.updateOne({ _id: req.params.id }, message).then(result => {
      res.status(200).json({ alert: "Update successful!" });
    });
  }
);

app.delete('/api/messages/:id', checkAuth, (req, res, next) => {
  Message.findById( req.params.id ).then(result => {
    if (result.imagePath) {
      const imagePath = result.imagePath.substring(result.imagePath.lastIndexOf('/') + 1);
      fs.unlink("backend/images/" + imagePath, (err => {
        if (err) console.log(err);
        else {
          console.log("File Deleted");
        }
      }));
    }
  });

  Message.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({
      alert: "Message deleted!"
    });
  });


});

module.exports = app;
