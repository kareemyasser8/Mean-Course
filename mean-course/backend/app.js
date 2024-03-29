const path = require('path')
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts')
const userRoutes = require('./routes/user')


const app = express();

mongoose.connect("mongodb+srv://kareemyasserr:" +
        process.env.MONGO_ATLAS_PW +
       "@cluster0.ia3rj3r.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log("connected to Database...")
  })
  .catch((err) => {
    console.log("connection Failed", err.message);
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  next()
})

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

// Enable CORS for all routes
app.use(cors());

app.use(
  cors({
    origin: 'https://mean-course-o4sudvjzx-kareemyasser8.vercel.app', // Replace with your allowed client-side domain
  })
);


module.exports = app;

