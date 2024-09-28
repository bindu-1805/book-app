const express = require('express');
const pool = require('./db');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
  const sortBy = req.query.sortBy || 'date_read';
  const books = await pool.query(`SELECT * FROM books ORDER BY ${sortBy} DESC`);
  res.render('index', { books: books.rows });
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', async (req, res) => {
  const { title, author, rating, review, cover_id } = req.body;
  const coverUrl = `https://covers.openlibrary.org/b/olid/${cover_id}-L.jpg`;
  await pool.query(
    'INSERT INTO books (title, author, cover_url, rating, review) VALUES ($1, $2, $3, $4, $5)',
    [title, author, coverUrl, rating, review]
  );
  res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const book = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
  res.render('edit', { book: book.rows[0] });
});

app.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, rating, review } = req.body;
  await pool.query(
    'UPDATE books SET title = $1, author = $2, rating = $3, review = $4 WHERE id = $5',
    [title, author, rating, review, id]
  );
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM books WHERE id = $1', [id]);
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
