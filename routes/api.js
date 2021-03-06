const router = require("express").Router();
const Transaction = require("../models/transaction.js");

router.post("/api/transaction", ({body}, res) => {
  console.log("post 1");

  Transaction.create(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

router.post("/api/transaction/bulk", ({body}, res) => {
  console.log("post");

  Transaction.insertMany(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

router.get("/api/transaction", (req, res) => {
  console.log("saving");
  Transaction.find({}).sort({date: -1})
    .then(dbTransaction => {
      console.log(dbTransaction);
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

module.exports = router;