const db = require("../models");
const IceCreamOrder = db.icecreamorder;

// Create and Save a new IceCreamOrder
exports.create = (req, res) => {
    // Validate request
    if (!req.body.user) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
  
    // Create a IceCreamOrder
    const icecreamorder = new IceCreamOrder({
      user: req.body.user,
      description: req.body.description,
      published: req.body.published ? req.body.published : false
    });
  
    // Save IceCreamOrder in the database
    icecreamorder
      .save(icecreamorder)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the IceCreamOrder."
        });
      });
  };
