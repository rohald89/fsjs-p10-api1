"use strict";
const auth = require("basic-auth");
const bcrypt = require("bcryptjs");
const users = require("../models").User;

exports.authUser = async (req, res, next) => {
  const creds = auth(req);
  if (creds) {
    const user = await users.findOne({
      where: {
        emailAddress: creds.name,
      },
    });
    if (user) {
      const authenticate = bcrypt.compareSync(creds.pass, user.password);
      if (authenticate) {
        req.currentUser = user; 
        next(); 
      }
      }else {
      res.status(401)
      res.json({
        message: "This email address does not exist.",
      });
    }
  } 
  
};
