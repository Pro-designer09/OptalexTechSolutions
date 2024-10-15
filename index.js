const session = require('express-session')
const express = require('express');
const app = express();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));


const bodyparser = require("body-parser");
const admin_route = require("./routes/admin");


// const mongoose = require("mongoose")
const conn = require("./src/db/conn");
const port = process.env.PORT || 3000;


app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/admin", admin_route);
 



app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/submit", (req, res) => {


  const { uuid_no, first_name, last_name, email, number, age, gender,  state, zipcode} =
    req.body;
  const sql = `INSERT INTO users(uuid_no, first_name,last_name,email, number, age, gender,state, zipcode) VALUES (?, ?, ?, ?,?,?, ?, ?, ?)`;

  conn.query(
    sql,
    [uuid_no, first_name, last_name, email, number, age, gender,  state, zipcode],
    (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).send("Failed to insert data");
      }
      
      res.redirect("/");
    }
  );
});



app.get("/policy", (req,res)=>{
  res.render("policy.ejs")
})







app.listen(port, () => {
  console.log(`Server is Started on port ${port}`);
});
