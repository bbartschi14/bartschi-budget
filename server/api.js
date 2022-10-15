/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import authentication library
const auth = require("./auth");
require("dotenv").config();

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

// MongoDB Models
const Transaction = require("./models/transaction");
const Category = require("./models/category");

router.post("/transaction", (req, res) => {
  const newTransaction = new Transaction({
    uuid: req.body.uuid,
    name: req.body.name,
    amount: req.body.amount,
    category: req.body.category,
    date: req.body.date,
  });
  console.log(newTransaction);
  newTransaction.save().then((transaction) => res.send(transaction));
});

router.get("/transactions", (req, res) => {
  Transaction.find({}).then((transactions) => {
    res.send(transactions);
  });
});

router.post("/transactions/delete", (req, res) => {
  Transaction.deleteOne({ uuid: req.body.uuid }).then((things) => res.send(things));
});

router.post("/category/add", (req, res) => {
  const newCategory = new Category({
    uuid: req.body.uuid,
    name: req.body.name,
    monthlyBudget: req.body.monthlyBudget,
    color: req.body.color,
    type: req.body.type,
  });
  newCategory.save().then((category) => res.send(category));
});

router.post("/category/update", (req, res) => {
  Category.findOne({ uuid: req.body.uuid }).then((category) => {
    category.name = req.body.name;
    category.monthlyBudget = req.body.monthlyBudget;
    category.color = req.body.color;
    category.type = req.body.type;
    category.save().then((c) => res.send(c));
  });
});

router.get("/categories", (req, res) => {
  Category.find({}).then((categories) => {
    res.send(categories);
  });
});

router.post("/enter", (req, res) => {
  res.send(req.body.password == process.env.BUDGET_PASSWORD);
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
