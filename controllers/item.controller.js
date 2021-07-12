const Item = require('../models/item.model');

const User = require('../models/user.model');
const sgMail = require('@sendgrid/mail');

exports.postItem = (req, res, next) => {
  const { title, dept, regNo, properties, type, private, phone } = req.body;

  console.log(req.file)
  const item = new Item({
    title: title,
    dept: dept,
    regNo: regNo,
    properties: properties,
    type: type,
    phone: phone,
    private: private,
    img: req.file.path,
    uid: req.user._id,
    name: req.user.name,
    email: req.user.email
  });
  
  item
    .save()
    .then((item) => {
      let type = item.type === 'LOST' ? 'FOUND' : 'LOST';
      return Item.find({ type: type });
    })
    .then((items) => {
      items.forEach((item) => {
        if (item.title.trim().toLowerCase() === title.trim().toLowerCase()) {
          User.findById(item.uid).then((user) => {
            if (user) {
              sendMail(req.user.email, item, user).catch(console.error);
            }
          });
        }
      });
       item.type === 'LOST' ? res.redirect('/lost-items') : res.redirect('/found-items');

      
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getLostPage = (req, res, next) => {
  Item.find({ type: 'LOST', private: { $ne: true } })
    .then((items) => {
      res.render('user/lostItem', {
        items: items,
        pageTitle: 'Product List',
        path: '/products',
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getFoundPage = (req, res, next) => {
  Item.find({ type: 'FOUND', private: { $ne: true } })
    .then((items) => {
      res.render('user/foundItem', {
        items: items,
        pageTitle: 'Product List',
        path: '/products',
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

//

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(email, item, founder) {
  sgMail.setApiKey(
    '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'
  );
  const msg = {
    to: 'mafzaal786hr@gmail.com', // Change to your recipient
    from: email, // Change to your verified sender
    subject: 'Found Your item',
    html: `
     For your lost item ${item.title} Please contact:
     <br/>
     Name: ${founder.name} <br/>
     Email: ${founder.email} <br/>
     Reg No#: ${item.regNo}<br/>
     Dept: ${item.dept}<br/>

     `,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error.body);
    });
}
