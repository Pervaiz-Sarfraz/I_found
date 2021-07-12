const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const session = require('express-session');

const MongoDbStore = require('connect-mongodb-session')(session);

const csrf = require('csurf');

const flash = require('connect-flash');

const multer = require('multer');

const errorController = require('./controllers/error');

const User = require('./models/user.model');

const MONGODB_URI =
  'mongodb+srv://engrmafzaalch:1122qqww@cluster0-cm2ar.mongodb.net/lostfound?retryWrites=true&w=majority';

const app = express();

const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const itemRoutes = require('./routes/item.routes');


const csrfProtection = csrf();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let path = './images';
    cb(null, path);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.set('view engine', 'ejs');
app.set('views', 'views');
 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);

      next(new Error(err));
    });
});

app.use(userRoutes);
app.use(authRoutes);
app.use(itemRoutes);
app.use('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.redirect('/500')
  console.log(error);
  if (req.session)
    res
      .status(500)
      .render('500', {
        pageTitle: 'Server Error',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn,
      });
  else
    res
      .status(500)
      .render('500', {
        pageTitle: 'Server Error',
        path: '/500',
        isAuthenticated: false,
      });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
