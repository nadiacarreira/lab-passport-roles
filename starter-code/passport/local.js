const bcrypt = require("bcrypt");
const passport = require('passport');
const User = require('../models/User');
const LocalStrategy = require("passport-local").Strategy;

/*Autentificación de usuario, vemos si el usuario es incorrecto o la contraseña
es incorrecta y le lanzamos los mensajes de error*/

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }
    return next(null, user);
  });
}));
