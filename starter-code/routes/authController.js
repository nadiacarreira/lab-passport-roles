const express = require("express");
const authController = express.Router();
// Passport require.
const passport = require("passport");
const User = require('../models/User')
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//creamos una peticion para conectarse con facebook y si es correcto pueda abrir su perfil sino volveremos a la raiz
authController.get("/facebook", passport.authenticate("facebook"));
authController.get("/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/private-profile",
  failureRedirect: "/"
}));

/*creamos una peticion para login a su vez, le mandamos que nos recoja la información (post) del formulario
si es correcto iremos al perfil privado, sino volverá a salirnos el login*/
authController.get('/login', (req, res) => {
  res.render('auth/login');
});

authController.post('/login', passport.authenticate('local' , {
  successRedirect: '/private-profile',
  failureRedirect: '/login',
}));

//para crear un nuevo usuario, tendremos un formulario ¿?¿?
authController.get('/newUser', (req, res) => {
  if(req.user && req.user.role == "Boss") res.render('auth/newUser');
  res.redirect('/')
});

//para recoger los datos del nuevo usuario lo hacemos con un req.body.(el nombre de cada input)
authController.post('/newUser', (req, res, user) => {
  const username = req.body.username;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const password = req.body.password;
  const role = req.body.role;

//se podría dividir para indicar qué campo ha dejado vacío el usuario?

  if (username == "" || password == "" || role == ""){
    res.render("auth/newUser", {
      errorMessage: "Indicate username, password and role"
    });
    return;
  }

//hay dos posibilidades que el usuario ya existe, si es asi, nos dará un error o que aún no está creado en nuestra base de datos.

  User.findOne({ "username": username}, (error, user) => {
    if (user !== null) {
      res.render("auth/newUser", {
        errorMessage: "Username already exist"
      });
      return;
    }
  });
//si el usuario se puede crear, encriptamos la contraseña, si no se puede crear nos dará un error
  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  var newUser = User({
    username,
    name,
    familyName,
    password: hashPass,
    role
  });

  newUser.save(error => {
    if (error) {
      res.render("auth/newUser", {
        errorMessage: "Couldn't create a new user"
      });
    } else {
      console.log('New User Created!');
      res.redirect('/private-profile');
    }
  });
});

// mandamos una peticion para borrar mediante el id que será univoco
authController.get('/:id/delete', (req, res) => {
  User.findByIdAndRemove({_id: req.params.id}, (error) => {
    res.redirect('/team');
  })
});

/* mandamos una peticion para editar mediante el id que será univoco
y en este caso tendremos un post para recoger los datos que se editen en el usuario mediante el req.body*/
authController.get('/:id/edit', (req, res) => {
  User.findById({_id: req.params.id}, (error, user) => {
    res.render('auth/edit', {user : user});
  })
});

authController.post('/:id/edit', (req, res) => {
  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(req.body.password, salt);

  var updateObj = {
    username: req.body.username,
    name: req.body.name,
    familyName: req.body.familyName,
    password: hashPass,
  };


  User.findByIdAndUpdate(req.params.id, updateObj, (error, user) => {
    res.redirect('/private-profile');
  })
});

// Cerrar sesion del usuario

authController.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = authController;
