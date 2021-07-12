const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

exports.getLogin = (req, res, next) => {
  res.render('user/log-in', {
    pageTitle: 'Product List',
    path: '/products',
  });
};

exports.postLogin = (req, res, next) => {
  let email = req.body.email;
  const password = req.body.password.trim();

  User.findOne({ email: email.toLowerCase() })
    .then((user) => {
      console.log('hello', user);
      // if(user){
      bcrypt.compare(password, user.password).then((doMatch) => {
        console.log(doMatch);
        if (!doMatch) {
          return res.status(422).render('user/log-in', {
            pageTitle: 'Product List',
            path: '/products',
          });
        } else {
          console.log(user);
          console.log(req.session);
          req.session.isLoggedIn = true;
          req.session.user = user;
          console.log(req.session);
          req.session.save(() => {
            return res.redirect('/');
          });
        }
      });
      // }
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getSignup = (req, res, next) => {
  res.render('user/sign-up', {
    pageTitle: 'Product List',
    path: '/products',
  });
};

exports.postSignup = (req, res, next) => {
  console.log(req.body);

  User.find({ email: req.body.email.toLowerCase().trim() })
    .then((user) => {
      if (user) {
        res.render('user/sign-up', {
          pageTitle: 'Product List',
          path: '/products',
          msg: 'User with this email exists',
        });
      }
      return bcrypt.hash(req.body.password, 12);
    })

    .then((hashedPassword) => {
      const user = new User({
        name: req.body.name,
        email: req.body.email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'USER',
      });

      return user.save();
    })
    .then((user) => {
      console.log(user);
      res.redirect('/login');
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
