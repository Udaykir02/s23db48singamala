const horses = require('../models/horses');
const ObjectId = require('mongoose').Types.ObjectId;

// List of all Horses
exports.horses_list = async function (req, res) {
    try {
        const result = await horses.find();
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

// Get details for a specific Horse.
exports.horses_detail = async function (req, res) {
    console.log("detail " + req.params.id);
    try {
        const result = await horses.findById(req.params.id);
        if (!result) {
            res.status(404).send({ error: `Document for id ${req.params.id} not found` });
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(500).send({ error: `Error: ${error.message}` });
    }
};

// Handle Horse create on POST.
exports.horses_create_post = async function (req, res) {
    console.log(req.body);
    const document = new horses();
    document.horse_name = req.body.horse_name;
    document.horse_age = req.body.horse_age;
    document.horse_price = req.body.horse_price;
    try {
        const result = await document.save();
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

// Handle Horse delete on DELETE.
exports.horses_delete = async function (req, res) {
    console.log("delete " + req.params.id);
    try {
        const result = await horses.findByIdAndDelete(req.params.id);
        console.log("Removed " + result);
        if (!result) {
            res.status(404).send({ error: `Document for id ${req.params.id} not found` });
        } else {
            res.send(result);
        }
    } catch (err) {
        res.status(500).send({ error: `Error deleting: ${err.message}` });
    }
};

// Handle Horse update form on PUT.
exports.horses_update_put = async function(req, res) { 
    console.log(`update on id ${req.params.id} with body 
${JSON.stringify(req.body)}`) 
    try { 
        let toUpdate = await horses.findById( req.params.id) 
        // Do updates of properties 
        if(req.body.horse_name)  
               toUpdate.horse_name = req.body.horse_name; 
        if(req.body.horse_age) toUpdate.horse_age = req.body.horse_age; 
        if(req.body.horse_price) toUpdate.horse_price = req.body.horse_price; 
        let result = await toUpdate.save(); 
        console.log("Sucess " + result) 
        res.send(result) 
    } catch (err) { 
        res.status(500) 
        res.send(`{"error": ${err}: Update for id ${req.params.id} 
failed`); 
    } 
}; 

// VIEWS
exports.horses_view_all_Page = async function (req, res) {
    try {
        const result = await horses.find();
        res.render('horses', { title: 'Horses Search Results', results: result });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};


exports.horses_view_one_Page = async function (req, res) {
    console.log("single view for id " + req.query.id);
    try {
        const result = await horses.findById(req.query.id);
        res.render('horsesdetail', { title: 'horse Detail', toShow: result });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

// Handle building the view for creating a horse.
exports.horses_create_Page = function (req, res) {
    console.log("create view");
    try {
        res.render('horsescreate', { title: 'Horse Create' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

// Handle building the view for updating a horse.
exports.horses_update_Page =  async function(req, res) { 
    console.log("update view for item "+req.query.id) 
    try{ 
        let result = await horses.findById(req.query.id) 
        res.render('horsesupdate', { title: 'Horses Update', toShow: result }); 
    } 
    catch(err){ 
        res.status(500) 
        res.send(`{'error': '${err}'}`); 
    } 
}; 


// Handle a delete one view with id from query
exports.horses_delete_Page = async function (req, res) {
    console.log("Delete view for id " + req.query.id);
    try {
        const result = await horses.findById(req.query.id);
        res.render('horsesdelete', {
            title: 'Horse Delete',
            toShow: result,
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};
