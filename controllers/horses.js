var horses = require('../models/horses');

// List of all Horses
exports.horses_list = async function (req, res) {
    try {
        thehorses = await horses.find();
        res.send(thehorses);
    } catch (err) {
        res.status(500).send({ error: err });
    }
};

// Get details for a specific Horse.
exports.horses_detail = async function(req, res) {
    console.log("detail" + req.params.id)
    try {
        result = await horses.findById(req.params.id)
        if (!result) {
            res.status(404).send({ error: `Document for id ${req.params.id} not found` });
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(500).send({ error: `Error: Document for id ${req.params.id} not found` });
    }
};

// Handle Horse create on POST.
exports.horses_create_post = async function (req, res) {
    console.log(req.body);
    let document = new horses();
    document.horse_name = req.body.horse_name;
    document.horse_age = req.body.horse_age;
    document.horse_price = req.body.horse_price;
    try {
        let results = await document.save();
        res.send(results);
    } catch (err) {
        res.status(500).send({ error: err });
    }
};

// Handle Horse delete on DELETE.
exports.horses_delete = async function(req, res) {
    console.log("delete " + req.params.id)
    try {
        result = await horses.findByIdAndDelete(req.params.id)
        console.log("Removed " + result)
        if (!result) {
            res.status(404).send({ error: `Document for id ${req.params.id} not found` });
        } else {
            res.send(result);
        }
    } catch (err) {
        res.status(500).send({ error: `Error deleting: ${err}` });
    }
};

// Handle Horse update form on PUT.
exports.horses_update_put = async function(req, res) {
    console.log(`update on id ${req.params.id} with body ${JSON.stringify(req.body)}`)
    try {
        let toUpdate = await horses.findById(req.params.id);
        // Do updates of properties
        if (req.body.horse_name) toUpdate.horse_name = req.body.horse_name;
        if (req.body.horse_age) toUpdate.horse_age = req.body.horse_age;
        if (req.body.horse_price) toUpdate.horse_price = req.body.horse_price;
        let result = await toUpdate.save();
        console.log("Success " + result)
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: `${err} - Update for id ${req.params.id} failed` });
    }
};

// VIEWS
// Handle a show all view
exports.horses_view_all_Page = async function (req, res) {
    try {
        result = await horses.find();
        res.render('horses', { title: 'Horses Search Results', results: result });
    } catch (err) {
        res.status(500).send({ error: err });
    }
};

exports.horses_view_one_Page = async function(req, res) {
    console.log("single view for id " + req.query.id)
    try {
        result = await horses.findById(req.query.id)
        res.render('horsesdetail', { title: 'horse Detail', toShow: result });
    } catch(err) {
        res.status(500).send({ error: err });
    }
};
