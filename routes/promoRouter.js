var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Promotions = require('../models/promotions');

var promoRouter = express.Router();
promoRouter.use(bodyParser.json());
promoRouter.route('/')

.get(Verify.verifyOrdinaryUser, function(req, res, next) {
    Promotions.find({}, function (err, promotions) {
        if (err) throw err;
        res.json(promotions);
    })
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Promotions.create(req.body, function (err, promotion) {
        if (err) throw err;
        console.log('promotions created');
        var id = promotions.id

        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.end('Added the promotion with id: ' + id);
    })
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Promotions.remove({}, function (err, resp){
        if (err) throw err;
        res.json(resp);
    })
});

promoRouter.route('/:promoId')

.get(function(req,res,next){
    Promotions.findById(req.params.promoId, function (err, promotion) {
        if (err) throw err;
        res.json(promotion);
    });
})

.put(function(req, res, next){
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, {
        new: true
    }, function (err, promotion) {
        if (err) throw err;
        res.json(promotion);
    });
})

.delete(function(req, res, next){
    Promotions.findByIdAndRemove(req.params.promoI, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

module.exports = promoRouter;
