var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Favorites = require('../models/favorites');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());
favoriteRouter.route('/')

.get(Verify.verifyOrdinaryUser, function(req, res, next) {
    Favorites.find({})
    .populate('postedBy dishes')
    .exec(function (err, favorites) {
        if (err) throw err;
        res.json(favorites);
    });
})

.post(Verify.verifyOrdinaryUser, function(req, res, next){
    Favorites.findOne({postedBy: req.decoded._doc._id}, function(err, favorites) {
        if (err) throw err;

        if (favorites.length === 0) {
            favorites = new Favorites({
                postedBy: req.decoded._doc._id,
            });
        }
        favorites.dishes.push(req.body._id);
        favorites.save(function (err, favorites) {
            if (err) throw err;
            res.json(favorites);
        });
    });
})

.delete(Verify.verifyOrdinaryUser, function(req, res, next){
    Favorites.findOne({postedBy: req.decoded._doc._id}, function(err, favorites) {
        if (err) throw err;

        favorites.dishes = [];
        favorites.save(function (err, favorites) {
            if (err) throw err;

            res.json(favorites);
        })
    });
});

favoriteRouter.route('/:dishObjectId')

.delete(Verify.verifyOrdinaryUser, function(req, res, next){

    Favorites.findOne({postedBy: req.decoded._doc._id}, function(err, favorites) {
        if (err) throw err;

        favorites.dishes = favorites.dishes.filter(function (value){
            console.log(value);
            return value != req.params.dishObjectId;
        })

        favorites.save(function (err, favorites) {
            if (err) throw err;
            res.json(favorites);
        })
    });
});

module.exports =  favoriteRouter;
