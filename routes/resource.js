var express = require('express');
var router = express.Router();
// Require controller modules.
var api_controller = require('../controllers/api');
var horses_controller = require('../controllers/horses');
/// API ROUTE ///
// GET resources base.
router.get('/', api_controller.api);
/// COSTUME ROUTES ///
// POST request for creating a Costume.
router.post('/horses', horses_controller.horses_create_post);
// DELETE request to delete Costume.
router.delete('/horses/:id', horses_controller.horses_delete);
// PUT request to update Costume.
router.put('/horses/:id', horses_controller.horses_update_put);
// GET request for one Costume.
router.get('/horses/:id', horses_controller.horses_detail);
// GET request for list of all Costume items.
router.get('/horses', horses_controller.horses_list);
module.exports = router;