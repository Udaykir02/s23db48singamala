const express = require('express');
const router = express.Router();
const Horse = require('../models/horses');

// List of all Horses
router.get('/', async (req, res) => {
    try {
        const horses = await Horse.find();
        res.send(horses);
    } catch (err) {
        res.status(500).send(`{"error": ${err}}`);
    }
});

// Get details for a specific Horse.
router.get('/:id', async (req, res) => {
    try {
        const detail = await Horse.findById(req.params.id);
        console.log("Fetched the horse details " + detail);
        res.send(detail);
    } catch (error) {
        res.status(500).send(`{"error": "Document for id ${req.params.id} not found"}`);
    }
});

// Handle Horse create on POST.
router.post('/', async (req, res) => {
    const { horse_name, horse_age, horse_price } = req.body;
    const newHorse = new Horse({ horse_name, horse_age, horse_price });
    
    try {
        const result = await newHorse.save();
        res.send(result);
    } catch (err) {
        res.status(500).send(`{"error": ${err}}`);
    }
});

// Handle Horse delete on DELETE.
router.delete('/:id', async (req, res) => {
    try {
        const result = await Horse.findByIdAndDelete(req.params.id);
        console.log("Removed the following Horse " + result);
        res.send(result);
    } catch (err) {
        res.status(500).send(`{"error": "Error deleting ${err}"}`);
    }
});

// Handle Horse update on PUT.
router.put('/:id', async (req, res) => {
    try {
        const horseUpdate = await Horse.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log("Successfully Updated the Horse " + horseUpdate);
        res.send(horseUpdate);
    } catch (err) {
        res.status(500).send(`{"error": "${err}: Update for id ${req.params.id} failed"}`);
    }
});

module.exports = router;
