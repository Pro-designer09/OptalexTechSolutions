const express = require("express");
const router = express.Router();
const conn = require("../src/db/conn");

// router.get("/",async(req,res)=>{
//     var data = conn.promise().query('SELECT * FROM users');
//     var obj = {"user": data};
//     res.render("admin/index.ejs",obj);
//     // console.log(obj)
// });

// router.get("/", async (req, res) => {
//     try {
//       const [results] = await conn.promise().query('SELECT * FROM users');
//       var obj = { "user": results };
//       res.render("admin/index", obj);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send("Database query error");
//     }
//   });

router.get("/", (req, res) => {
  conn.query("SELECT * FROM users", (err, results) => {
    if (err) {
      // Handle error
      console.error(err);
      return res.status(500).send("Database query error");
    }
    // Pass the results to the template
    var obj = { user: results };
    res.render("admin/index.ejs", obj);
    // next();
  });



});

// router.get("/", (req,res)=>{
//     conn.query("SELECT COUNT(*) AS userCount FROM users", (error, results) => {
//         if (error) throw error;
//         const userCount = results[0].userCount;
//         // console.log(userCount);
//         var obj = {userCount: results}
//         // res.render("admin/index.ejs", { userCount: userCount }); // Pass the user count to EJS template
//         res.render("admin/index.ejs",obj);
//       });
// })

module.exports = router;
