const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to `contactdb`
const contactDB = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ajay',
  database: 'contactdb'
});

// Connect to `packers`
const packersDB = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ajay',
  database: 'packers'
});

// Check DB connections
contactDB.connect((err) => {
  if (err) throw err;
  console.log('Connected to contactdb');
});
packersDB.connect((err) => {
  if (err) throw err;
  console.log('Connected to packers db');
});

// ===== USER ROUTES =====
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  contactDB.query(
    'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
    [name, email, message],
    (err) => {
      if (err) return res.status(500).send('Failed to save contact');
      res.send('Contact saved successfully!');
    }
  );
});

// ===== ADMIN ROUTES =====
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin', 'login.html'));
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin', 'dashboard.html'));
});

// Enquiries from contactdb
app.get('/admin/enquiries', (req, res) => {
  contactDB.query('SELECT * FROM contacts', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    res.json(results);
  });
});

// Reviews
app.get('/admin/reviews', (req, res) => {
  packersDB.query('SELECT * FROM reviews', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    res.json(results);
  });
});

app.post('/submit-review', (req, res) => {
  const { name, review } = req.body;
  packersDB.query('INSERT INTO reviews (name, review) VALUES (?, ?)', [name, review], (err) => {
    if (err) return res.status(500).send('Error saving review');
    res.send('Review saved');
  });
});

// Blogs
app.get('/admin/blogs', (req, res) => {
  packersDB.query('SELECT * FROM blogs', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    res.json(results);
  });
});

app.post('/admin/blogs', (req, res) => {
  const { title, content } = req.body;
  packersDB.query('INSERT INTO blogs (title, content) VALUES (?, ?)', [title, content], (err) => {
    if (err) return res.status(500).send('Error saving blog');
    res.send('Blog added');
  });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
