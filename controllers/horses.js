var horses = require('../models/horses');

// List of all Horses
exports.horses_list = async function (req, res) {
    try {
        thehorses = await horses.find();
        res.send(thehorses);
    } catch (err) {
        res.status(500);
        res.send(`{"error": ${err}}`);
    }
};

// Get details for a specific Horse.
exports.horses_detail = async function (req, res) {
    try {
        const detail = await horses.findById(req.params.id);
        console.log("Fetched the horses details " + detail);
        res.send(detail);
    } catch (error) {
        res.status(500).send(`{"error": "Document for id ${req.params.id} not found"}`);
    }
};


// Handle Horse create on POST.
exports.horses_create_post = async function (req, res) {
    console.log(req.body);
    let document = new horses();
    document.size = req.body.size;
    document.colour = req.body.colour;
    document.price = req.body.price;
    try {
        let results = await document.save();
        res.send(results);
    } catch (err) {
        res.status(500);
        res.send(`{"error": ${err}}`);
    }
};

// Handle Horse delete form on DELETE.
exports.horses_delete = async function (req, res) {
    try {
        result = await horses.findByIdAndDelete(req.params.id);
        console.log("Removed the following Horse " + result);
        res.send(result);
    } catch (err) {
        res.status(500);
        res.send(`{"error": "Error deleting ${err}"}`);
    }
};

// Handle Horse update form on PUT.
exports.horses_update_put = async function (req, res) {
    try {
        let horsesUpdate = await horses.findById(req.params.id);
        if (req.body.size)
            horsesUpdate.size = req.body.size;
        if (req.body.colour)
            horsesUpdate.colour = req.body.colour;
        if (req.body.price)
            horsesUpdate.price = req.body.price;
        let result = await horsesUpdate.save();
        console.log("Successfully Updated the Horse " + result);
        res.send(result);
    } catch (err) {
        res.status(500);
        res.send(`{"error": "${err}: Update for id ${req.params.id} failed"}`);
    }
};

// VIEWS
// Handle a show all view
exports.horses_view_all_Page = async function (req, res) {
    try {
        thehorses = await horses.find();
        res.render('horses', { title: 'Horses Search Results', results: thehorses });
    } catch (err) {
        res.status(500);
        res.send(`{"error": ${err}}`);
    }
};