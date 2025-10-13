const insertDataRouter = require("express").Router();

const { insertProduct, insertCategory } = require("../controllers/insertData");

insertDataRouter.post("/", insertProduct);
insertDataRouter.post("/cate", insertCategory);

module.exports = insertDataRouter;
