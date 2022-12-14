/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

import express from "express";

// import authentication library
import auth from "./auth.js";
import dotenv from "dotenv";
dotenv.config();

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

// MongoDB Models
import Transaction from "./models/transaction.js";
import Category from "./models/category.js";

router.post("/transaction", (req, res) => {
  const newTransaction = new Transaction({
    uuid: req.body.uuid,
    user: req.body.user,
    name: req.body.name,
    amount: req.body.amount,
    category: req.body.category,
    date: new Date(req.body.date).toLocaleDateString(),
  });
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

router.post("/category/delete", (req, res) => {
  Category.deleteOne({ uuid: req.body.uuidToDelete }).then((c) => {
    const filter = { category: req.body.uuidToDelete };

    const updateTransactions = {
      $set: {
        category: req.body.uuidToReplace,
      },
    };

    Transaction.updateMany(filter, updateTransactions).then((t) => {
      res.send(t);
    });
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

export default router;
