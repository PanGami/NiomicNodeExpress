const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/UserScema");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      function (email, password, done) {
        User.findOne({
          email: email,
        })
          .then(async (user) => {
            console.log(user);
            if (user) {
              if (await bcrypt.compare(password, user.password)) {
                console.log(password, "  = ", user.password);
                return done(null, user);
              } else {
                return done(null, false, { message: "Password Anda Salah" });
              }
            } else {
              return done(null, false, { message: "Email Anda Salah" });
            }
          })
          .catch((err) => {
            console.log("Internal Server Error" + err.message);
          });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
