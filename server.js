const express = require('express');
const session = require('express-session');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'my_session_secret',
  resave: false,
  saveUninitialized: false,
  name: 'hmk'
}));

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  res.locals.user = req.session.user;
  next();
});

// Root route acts as login page
app.get('/', (req, res) => {
  if (!req.session.user) {
    res.render('login', { error: null });
  } else {
    res.redirect('/home');
  }
});

app.post('/', (req, res) => {
  if (req.body.username === 'simi' && req.body.password === '123') {
     req.session.user = { name:req.body.username };
    res.redirect('/home');
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
});

app.get('/home', (req, res) => {
  if (req.session.user) {
    res.render('home');
  } else {
    res.redirect('/');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('hmk');
    res.redirect('/');
  });
});

app.listen(3000, () => console.log('Server started on port 3000'));