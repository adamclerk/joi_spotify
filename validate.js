#!/usr/bin/env node

console.log("request does not work with Node v0.12.x...fyi");

var Joi = require("joi");
var request = require("request");

//object without unknown: all fields must be described
var image = Joi.object().keys({
  height: Joi.number().min(1),
  width: Joi.number().min(1),
  url: Joi.string()
});

//object with unknown: not necessary to describe all fields
var album = Joi.object().unknown().keys({
  name: Joi.string(),
  type: Joi.string(),
  uri: Joi.string(),
  images: Joi.array().includes(image)
});
var searchResult = Joi.object().unknown().keys({
  albums: Joi.object().unknown().keys({
    href: Joi.string(),
    items: Joi.array().includes(album)
  })
});

var url = "https://api.spotify.com/v1/search?q=lump&type=album,track";

request(url, function (err, response, body) {
  var obj = JSON.parse(body);
  Joi.validate(obj, searchResult, function(err){
    if(!err){
      console.log("PASS");
    } else {
      console.log("FAIL");
      console.log(err);
    }
  });
});
