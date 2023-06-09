"use strict";

const bcrypt      = require("bcrypt");
const formidable  = require("formidable");
const fs          = require("fs");
const nem         = require("nemjs");

const UserModel     = require("../model/UserModel");
const CommentModel  = require("../model/CommentModel");
const ReviewModel   = require("../model/ReviewModel");

require("dotenv").config();

const USERS_THUMB = process.env.THUMB_URL + "users/";
const form = formidable({ uploadDir: USERS_THUMB, keepExtensions: true });

//! ****************************** CHECKERS ******************************

/**
 * CHECK USER DATA
 * @param {string} name
 * @param {string} email 
 * @param {string} role 
 * @param {object} res 
 * @returns
 */
exports.checkUserData = (name, email, role, res) => {
  let alert = "";

  if (!nem.checkString(role)) { 
    alert = process.env.CHECK_ROLE 
  }

  if (!nem.checkEmail(email)) { 
    alert = process.env.CHECK_EMAIL 
  }

  if (!nem.checkString(name)) {
    alert = process.env.CHECK_NAME 
  }

  if (alert !== "") {
    return res.status(403).json({ message: alert });
  }
}

/**
 * CHECK USER PASSWORD
 * @param {string} pass 
 * @param {object} res 
 * @returns 
 */
exports.checkUserPass = (pass, res) => {
  if (!nem.checkPass(pass)) { 
    return res.status(403).json({ message: process.env.CHECK_PASS }) 
  }
}

/**
 * CHECK USER UNIQUE
 * @param {string} name 
 * @param {string} email 
 * @param {object} user 
 * @param {object} res 
 * @returns 
 */
exports.checkUserUnique = (name, email, user, res) => {
  if (user.name === name) {
    return res.status(403).json({ message: process.env.DISPO_NAME });
  }

  if (user.email === email) {
    return res.status(403).json({ message: process.env.DISPO_EMAIL });
  }
}

/**
 * CHECK USERS FOR UNIQUE
 * @param {string} id 
 * @param {array} users 
 * @param {object} fields 
 * @param {object} res 
 */
exports.checkUsersForUnique = (id, users, fields, res) => {
  for (let user of users) { 
    if (!user._id.equals(id)) { 
      this.checkUserUnique(fields.name, fields.email, user, res) 
    } 
  }
}

//! ****************************** GETTERS ******************************

/**
 * GET USER CREATED
 * @param {string} name 
 * @param {string} email 
 * @param {string} image 
 * @param {string} pass 
 * @param {string} role 
 * @param {string} created 
 * @param {string} updated 
 * @returns 
 */
exports.getUserCreated = (name, email, image, pass, role, created, updated) => {

  return {
    name: name,
    email: email,
    image: image,
    pass: pass,
    role: role,
    created: created,
    updated: updated
  }
}

/**
 * GET USER WITH PASSWORD
 * @param {string} name 
 * @param {string} email 
 * @param {string} image 
 * @param {string} pass 
 * @param {string} role 
 * @param {string} updated 
 * @returns 
 */
exports.getUserWithPass = (name, email, image, pass, role, updated) => {

  return {
    name: name,
    email: email,
    image: image,
    pass: pass,
    role: role,
    updated: updated
  }
}

/**
 * GET USER NO PASSWORD
 * @param {string} name 
 * @param {string} email 
 * @param {string} image 
 * @param {string} role 
 * @param {string} updated 
 * @returns 
 */
exports.getUserNoPass = (name, email, image, role, updated) => {

  return {
    name: name,
    email: email,
    image: image,
    role: role,
    updated: updated
  }
}

/**
 * GET USER UPDATED
 * @param {object} fields 
 * @param {string} image 
 * @param {object} res 
 * @returns 
 */
exports.getUserUpdated = (fields, image, res) => {
  let user;

  if (fields.pass) {
    this.checkUserPass(fields.pass, res);

    bcrypt
    .hash(fields.pass, 10)
    .then((hash) => { 
      user = this.getUserWithPass(fields.name, fields.email, image, hash, fields.role, fields.updated) 
    })
    .catch(() => res.status(400).json({ message: process.env.USER_NOT_PASS }));

  } else { 
    user = this.getUserNoPass(fields.name, fields.email, image, fields.role, fields.updated) 
  }

  return user;
}

//! ****************************** SETTERS ******************************

/**
 * SET MESSAGE
 * @param {string} fields 
 * @param {object} res 
 */
exports.setMessage = (fields, res) => {
  const mailer = nem.getMailer();

  (async function(){
    try {
      let mail = nem.getMessage(fields);

      await mailer.sendMail(mail, function() {
        res.status(202).json({ message: process.env.USER_MESSAGE });
      });
    } catch(e){ console.error(e); }
  })();
}

//! ****************************** PUBLIC ******************************

/**
 * CREATE USER
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.createUser = (req, res, next) => {
  form.parse(req, (err, fields, files) => {
    if (err) { next(err); return }

    this.checkUserData(fields.name, fields.email, fields.role, res);
    this.checkUserPass(fields.pass, res);

    UserModel
      .find()
      .then((users) => {
        for (let user of users) { 
          this.checkUserUnique(fields.name, fields.email, user, res);
        }

        let image = nem.getUniqueName(fields.name) + "." + process.env.IMG_EXT;
        nem.setThumbnail("users/" + files.image.newFilename, process.env.THUMB_URL + "users/" + image);

        bcrypt
          .hash(fields.pass, 10)
          .then((hash) => {
            let user = new UserModel(this.getUserCreated(fields.name, fields.email, image, hash, fields.role, fields.created, fields.updated));

            user
              .save()
              .then(() => {
                fs.unlink(USERS_THUMB + files.image.newFilename, () => {
                  res.status(201).json({ message: process.env.USER_CREATED })
                })
              })
              .catch(() => res.status(400).json({ message: process.env.USER_NOT_CREATED }));

          })
          .catch(() => res.status(400).json({ message: process.env.USER_NOT_PASS }));
      })
      .catch(() => { res.status(404).json({ message: process.env.USERS_NOT_FOUND }) });
  });
}

/**
 * SEND USER MESSAGE
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.sendMessage = (req, res, next) => {
  form.parse(req, (err, fields) => {
    if (err) { next(err); return }

    fields.html = `<p>${fields.html}</p>`;
    this.setMessage(fields, res);
  })
}

//! ****************************** PRIVATE ******************************

/**
 * LIST ALL USERS WITHOUT PASSWORD
 * @param {object} req 
 * @param {object} res 
 */
exports.listUsers = (req, res) => {
  UserModel
    .find()
    .then((users) => {
      let usersList = [];

      for (let user of users) {
        let userSafe = {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          created: user.created,
          updated: user.updated,
        };

        usersList.push(userSafe);
      }
      res.status(200).json(usersList);
    })
    .catch(() => res.status(404).json({ message: process.env.USERS_NOT_FOUND }));
}

/**
 * READ A USER
 * @param {object} req 
 * @param {object} res 
 */
exports.readUser = (req, res) => {
  UserModel
  .findById(req.params.id)
  .then((user) => res.status(200).json(user))
  .catch(() => res.status(404).json({ message: process.env.USER_NOT_FOUND }));
}

/**
 * UPDATE USER
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.updateUser = (req, res, next) => {
  form.parse(req, (err, fields, files) => {
    if (err) { next(err); return }

    this.checkUserData(fields.name, fields.email, fields.role, res);

    UserModel
      .find()
      .then((users) => {
        this.checkUsersForUnique(req.params.id, users, fields, res);

        let image = fields.image;

        if (files.image.newFilename) { 
          nem.setThumbnail("users/" + files.image.newFilename, process.env.THUMB_URL + "users/" + image);
        }

        let user = this.getUserUpdated(fields, image, res);

        UserModel
          .findByIdAndUpdate(req.params.id, { ...user, _id: req.params.id })
          .then(() => {
            if (files.image.newFilename) { fs.unlink(USERS_THUMB + files.image.newFilename, () => {}) }
            res.status(200).json({ message: process.env.USER_UPDATED });
          })
          .catch(() => res.status(400).json({ message: process.env.USER_NOT_UPDATED }));
      })
      .catch(() => res.status(404).json({ message: process.env.USERS_NOT_FOUND }));
  })
}

/**
 * DELETE USER
 * @param {object} req 
 * @param {object} res 
 */
exports.deleteUser = (req, res) => {
  UserModel
    .findById(req.params.id)
    .then(user => {
      fs.unlink(USERS_THUMB + user.image, () => {

        CommentModel
          .deleteMany({ user: req.params.id })
          .then(() =>

            ReviewModel
              .deleteMany({ user: req.params.id })
              .then(() => 

                UserModel
                  .findByIdAndDelete(req.params.id)
                  .then(() => res.status(204).json({ message: process.env.USER_DELETED }))
                  .catch(() => res.status(400).json({ message: process.env.USER_NOT_DELETED }))
              )
              .catch(() => res.status(400).json({ message: process.env.REVIEWS_NOT_DELETED }))
          )
          .catch(() => res.status(400).json({ message: process.env.COMMENTS_NOT_DELETED }))
      })
    })
    .catch(() => res.status(404).json({ message: process.env.USER_NOT_FOUND }));
}
