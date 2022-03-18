var express = require("express");
var router = express.Router();
const users = require("../models").User;
const { authUser } = require("../middleware/authenticate");

router.use(express.json());

router.get("/api/users", authUser, async (req, res) => {
  try {
    const user = req.currentUser;

    res.json(user);
  } catch (err) {
    res.json({
      message: "Something went wrong with the server:",
    });
  }
});

//----------------USER POST ROUTE -------------------//

router.post("/api/users", async (req, res) => {
  try {
    const newUser = await users.create(req.body);
    res.location("/");
    res.status(201).json("");
  } catch (err) {
    res.status(400);
    res.json({
      message: err.errors.map((erry) => erry.message),
    });
  }
});

module.exports = router;
