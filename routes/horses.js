var express = require('express');
const horses_controllers = require('../controllers/horses');
var router = express.Router();

// A little function to check if we have an authorized user and continue on
// or redirect to login.
const secured = (req, res, next) => {
    if (req.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
}

/* GET horses listing. */
router.get('/', horses_controllers.horses_view_all_Page);

// GET request for one horse.
router.get('/horses/:id', horses_controllers.horses_detail);

/* GET detail horse page */
router.get('/detail', horses_controllers.horses_view_one_Page);

// /* GET create horse page */
// router.get('/create', secured, horses_controllers.horses_create_Page);

// /* GET update horse page */
// router.get('/update', secured, horses_controllers.horses_update_Page);

// /* GET delete horse page */
// router.get('/delete', secured, horses_controllers.horses_delete_Page);

module.exports = router;
