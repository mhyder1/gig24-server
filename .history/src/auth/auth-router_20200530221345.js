const express = require("express");
const AuthService = require("./auth-service");
const { requireAuth } = require("../middleware/jwt-auth");

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter
.post("/login", jsonBodyParser, (req, res, next) => {
  const knexInstance = req.app.get("db");
  const { username, password } = req.body;
  console.log(password);

  const loginUser = { username, password };

  for (const [key, value] of Object.entries(loginUser))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });

  AuthService.getUserWithUserName(knexInstance, loginUser.username)
    .then((dbUser) => {
      console.log(dbUser, 'testing..');
    
      if (!dbUser)
        return res.status(400).json({
          error: 'Incorrect username or password',
        })

      if (loginUser.password === dbUser.password) {
        const sub = dbUser.username;
        const payload = { user_id: dbUser.id, fullname: dbUser.fullname };
        console.log(payload);
        res.send({
          authToken: AuthService.createJwt(sub, payload),
          username: dbUser.username,
        });
      } else {
        return res.status(400).json({
          error: "Incorrect username or password",
        });
      }
    })
    .catch(next);
});

authRouter.post("/refresh", requireAuth, (req, res) => {
  const sub = req.user.username;
  const payload = { user_id: req.user.id };
  res.send({
    authToken: AuthService.createJwt(sub, payload),
  });
});

module.exports = authRouter;
