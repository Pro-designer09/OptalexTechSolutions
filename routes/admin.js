const express = require("express");
const router = express.Router();
const conn = require("../src/db/conn");

const adminUsername = 'admin';
const adminPassword = 'password';


// Middleware to protect admin routes
function ensureAuthenticated(req, res, next) {
  if (req.session.isAdmin) {
      return next();
  }
  res.redirect('/admin/login');
}

// Admin login page
router.get('/login', (req, res) => {
  res.render("admin/login.ejs");
});

// router.post('/login', (req, res) => {

//   const { username, password } = req.body;

//   // Check credentials
//   if (username === adminUsername && password === adminPassword) {
//       req.session.isAdmin = true;
//       return res.redirect('/admin');
//   }

//   res.send('Invalid credentials, please <a href="/admin/login">try again</a>');
// });




// Handle admin login form submission
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Query the database to find the admin
  const sql = 'SELECT * FROM admins WHERE username = ?';
  
  conn.query(sql, [username], (err, result) => {
      if (err) {
          console.error('Database query error:', err);
          return res.status(500).send('Internal Server Error');
      }

      // Check if the admin exists
      if (result.length > 0) {
          const admin = result[0];
          
          // Compare the password (you may want to hash passwords in production)
          if (admin.password === password) {
              // Successful login
              req.session.isAdmin = true;
              return res.redirect('/admin');
          } else {
              // Invalid password
              res.send('Invalid password, please <a href="/admin/login">try again</a>');
          }
      } else {
          // Invalid username
          res.send('Invalid username, please <a href="/admin/login">try again</a>');
      }
  });
});




router.get("/", ensureAuthenticated,(req, res) => {
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


router.get('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.redirect('/admin');
      }
      res.render('admin/login.ejs');
  });
});


module.exports = router;
