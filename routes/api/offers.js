const express = require("express");
const passport = require("../../config/passport");
const router = express.Router();
const Offer = require("../../models/Offer");
const validateOffer = require("../../validation/offers");

router.get('/', (req, res) => {
    Offer.find()
        .sort({ date: -1 })
        .then(offers => res.json(offers))
        .catch(err => res.status(404).json({ nooffersfound: "No offers found"}))
})

router.get('/user/:user_id', (req, res) => {
    Offer.find({ user: req.params.user_id})
        .then(offers => res.json(offers))
        .catch(err => res.status(404).json({ nooffersfound: "No offers found for that user"}))
})

router.get('/:id', (req, res) => {
    Offer.findById(req.params.id)
        .then(offer => res.json(offer))
        .catch(err => res.status(404).json({ noofferfound: "No offer found with that id"}))
})

router.post('/', (req, res) => {
    const { errors, isValid } = validateOffer(req.body)
    if (!isValid){
        return res.status(400).json(errors);
    }
    const newOffer = new Offer({
        user: req.body.user,
        text: req.body.text,
        receiver: req.body.receiver,
        price: req.body.price,
        items: req.body.items,
        postId: req.body.postId
    })
    newOffer.save().then(offer=>
        res.json(offer)
    )
})

module.exports = router;