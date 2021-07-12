exports.getIndex = (req, res, next) => {

    res.render('user/index', {
     
        pageTitle: 'Product List',
        path: '/products'
    });
};

exports.getLostForm = (req, res, next) => {

    res.render('user/post-form', {
        private: false,
        pageTitle: 'Product List',
        path: '/products',
        type: 'LOST'
    });
};
exports.getFoundForm = (req, res, next) => {

    res.render('user/post-form', {
        private: false,
        pageTitle: 'Product List',
        path: '/products',
        type: 'FOUND'
    });
};

exports.getReportFound = (req, res, next) => {

    res.render('user/post-form', {
        private: true,
        pageTitle: 'Product List',
        path: '/products',
        type: 'FOUND'
    });
};

exports.getReportLost = (req, res, next) => {

    res.render('user/post-form', {
        private: true,
     
        pageTitle: 'Product List',
        path: '/products',
        type: 'LOST'
    });
};


exports.getTerms = (req, res, next) => {

    res.render('user/terms', {
     
        pageTitle: 'Product List',
        path: '/products'
    });
};

exports.getPrivacy = (req, res, next) => {

    res.render('user/privacy', {
     
        pageTitle: 'Product List',
        path: '/products'
    });
};