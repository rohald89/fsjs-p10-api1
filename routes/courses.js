var express = require("express");
var router = express.Router();
const courses = require("../models").Course;
const { authUser } = require("../middleware/authenticate");
const users = require('../models').User

router.use(express.json());

//--------------GET ROUTES------------------//

router.get("/api/courses", async (req, res) => {
  try {
    const allCourses = await courses.findAll({
      include: {
        model: users,
        attributes: {
          exclude: ['id', 'password', 'createdAt', 'updatedAt']
        }
      }
    });
    res.json(allCourses);
  } catch (err) {
    res.json({
      message: "Something went wrong on the server",
    });
    console.log(err);
  }
});

router.get("/api/courses/:id", async (req, res) => {
  try {
    const singleCourse = await courses.findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: users,
        as: 'User',
        attributes: {
          exclude: ['id', 'password', 'createdAt', 'updatedAt']
        }
      }
    });
    if (singleCourse) {
      

      res.status(200).json(singleCourse);


    } else {
      res.status(404);
      res.json({
        message: "This course dose not exist yet!",
      });
    }
  } catch (err) {
    res.json({
      message: "Something went wrong on the server",
    });
    console.log(err);
  }
});

//-----------------POST ROUTES-----------------------//

router.post("/api/courses/", authUser,  async (req, res) => {
  try {
      
      const newCourse = await courses.create(req.body);
      
      res.location("/api/course/" + newCourse.id);
      res.status(201);
      res.json(newCourse.id)
    
    
  } catch (err) {
    res.json({
      message: err
    });
  }
});

//---------------------PUT ROUTE----------------------------//

router.put("/api/courses/:id", authUser, async (req, res) => {
  try {
    const findCourse = await courses.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (findCourse) {
      //----IF ITS A VALID COURSE--//
      const updateCourse = await findCourse.update(req.body);
      res.status(204);
      res.end()
      
      
    } else {
      res.json({
        message: "Could not find course",
      });
    }
  } catch (err) {
    res.json({
      message: err
    });
    
  }
});

//-----------------DELETE ROUTE-------------------//

router.delete("/api/courses/:id", authUser, async (req, res) => {
  try {
    const findCourse = await courses.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (findCourse) {
      const deleteCourse = await findCourse.destroy();
      res.status(204);
      res.end();
    } else {
      res.json({
        message: "This course may not exisit",
      });
    }
  } catch (err) {
    res.json({
        message: "Something went wrong",
      });
      console.log(err);
  }
});

module.exports = router;
