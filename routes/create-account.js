'use strict';

const express = require('express');
const router = express.Router();
var knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const {camelizeKeys, decamelizeKeys} = require('humps');
var cookieParser = require('cookie-parser')
var strava = require('strava-v3');
const boom = require('boom');

router.get('/', function(req, res, next){
  knex('users').where('email', req.cookies['/user']).first()
  .then(function(results){

    if(results.strava_account_check === false){
      res.render('create-account')
    } else {
      res.redirect('dashboard')
    }
  })
})

module.exports = router;
