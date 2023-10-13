import express, { Router } from "express";
import db from "../module/connect.js";

const productRouter = express.Router();

//--------------------商品列表--------------------
productRouter.post("/", async (req, res) => {
  let output = {
    rows: [],
    rowsWish: [],
    rowsType: [],
    rowsTypeList: [],
  };

  //#region (商品條件)
  const orderCondition =
    req.body.order === "new"
      ? "product.createTime DESC"
      : req.body.order === "pHigh"
      ? "product.price DESC"
      : "product.price ASC";

  const search = req.body.search
    ? `AND product.product_name LIKE '%${req.body.search}%'`
    : "";

  const type = req.body.type
    ? `AND product_type.product_type_name = '${req.body.type}'`
    : req.body.typeList
    ? `AND product_type_list.product_type_list_name = '${req.body.typeList}'`
    : "";
  //#endregion

  const sql = `SELECT * FROM product JOIN product_img ON product.product_id=product_img.product_id JOIN product_type ON product.product_type_id = product_type.product_type_id JOIN product_type_list ON product.product_type_list_id = product_type_list.product_type_list_id WHERE showed_1st = 1 ${search} ${type} ORDER BY ${orderCondition}`;
  const sqlType = `SELECT * FROM product_type`;
  const sqlTypeList = `SELECT * FROM product_type_list`;
  // console.log(req.body.uid);
  if (req.body.uid) {
    const sqlWish = `SELECT * FROM product JOIN collection ON product.product_id = collection.product_id WHERE collection.user_id = 10 ORDER BY product.product_id;`;
    // const sqlWish = `SELECT * FROM product JOIN collection ON product.product_id = collection.product_id WHERE collection.user_id = ${req.body.uid} ORDER BY product.product_id;`;
    const [rowsWish] = await db.query(sqlWish);
    output.rowsWish = rowsWish;
  }

  // `SELECT * FROM product JOIN product_img ON product.product_id=product_img.product_id LEFT JOIN collection ON product.product_id = collection.product_id WHERE product_img.showed_1st = 1 ORDER BY product.product_id;`

  const [rows] = await db.query(sql);
  const [rowsType] = await db.query(sqlType);
  const [rowsTypeList] = await db.query(sqlTypeList);

  output.rows = rows;
  output.rowsType = rowsType;
  output.rowsTypeList = rowsTypeList;

  // console.log(output);
  res.json(output);
});

//加問號兩個param都沒給就不會跳錯

//--------------------商品詳細頁-------------------
productRouter.get("/:pid/:uid?", async (req, res) => {
  const pid = req.params.pid;
  const uid = req.params.uid;
  console.log(uid);

  let output = {
    rows: [],
    rowsImgs: [],
    rowsWished: false,
    rowsComment: [],
  };
  // const sql = `SELECT * FROM product LEFT JOIN oder_detail ON oder_detail.product_id = product.product_id LEFT JOIN order_general ON oder_detail.order_id = order_general.order_id LEFT JOIN user ON order_general.user_id = user.user_id WHERE product.product_id = ${pid};`;
  const sql = `SELECT * FROM product WHERE product_id = ${pid}`;
  const sqlImgs = `SELECT product_img FROM product_img JOIN product ON product_img.product_id = product.product_id WHERE product_img.product_id = ${pid};`;
  const sqlComment = `SELECT * FROM oder_detail JOIN order_general ON oder_detail.order_id = order_general.order_id JOIN user ON order_general.user_id = user.user_id WHERE oder_detail.product_id = ${pid};`;

  const [[rows]] = await db.query(sql);
  output.rows = rows;
  const [rowsImgs] = await db.query(sqlImgs);
  output.rowsImgs = rowsImgs;
  const [rowsComment] = await db.query(sqlComment);
  output.rowsComment = rowsComment;

  if (uid) {
    const sqlWished = `SELECT * FROM product JOIN collection ON product.product_id = collection.product_id WHERE product.product_id = ${pid} AND collection.user_id = ${uid}`;

    const [rowsWished] = await db.query(sqlWished);
    output.rowsWished = rowsWished.length > 0 ? true : false;
  }
  // console.log(output);
  res.json(output);
});

//--------------------推薦商品--------------------
productRouter.post("/product-recommend", async (req, res) => {
  console.log("12點了");
  let output = {
    rowsRecommend: [],
    rowsRecommendFront: [],
  };

  if (req.body.tid) {
    const sqlRecommend = `SELECT * FROM product JOIN product_img ON product_img.product_id = product.product_id WHERE product_img.showed_1st = 1 AND product_type_list_id = ${req.body.tid} LIMIT 6`;

    const [rowsRecommend] = await db.query(sqlRecommend);
    output.rowsRecommend = rowsRecommend;
  } else {
    const sqlRecommendFront = `SELECT oder_detail.product_id, product_img.product_img, SUM(order_quantity) FROM oder_detail JOIN product_img ON product_img.product_id = oder_detail.product_id WHERE product_img.showed_1st = 1 GROUP BY oder_detail.product_id LIMIT 8;`;
    const [rowsRecommendFront] = await db.query(sqlRecommendFront);
    output.rowsRecommendFront = rowsRecommendFront;
  }
  // console.log(req.body.tid);

  console.log(output);
  res.json(output);
});

//--------------------收藏列表---------------------
//還沒抓到uid版
productRouter.post("/wishList", async (req, res) => {
  // const uid = req.body.uid;
  // console.log(uid);

  const sql = `SELECT * FROM collection JOIN product ON collection.product_id = product.product_id JOIN product_img ON product_img.product_id = product.product_id WHERE user_id = 10 AND product_img.showed_1st = 1;`;
  // const sql = `SELECT * FROM collection WHERE user_id = ${uid}`;
  console.log("有事嗎");
  try {
    const [rows] = await db.query(sql);
    console.log(rows);
    res.json(rows);
  } catch (ex) {
    console.log(ex);
  }
});

//--------------------加入收藏---------------------
productRouter.post("/add-wish", async (req, res) => {
  // const pathName = req.body.pathName;

  const pid = req.body.pid;
  console.log(pid);

  const sql = `INSERT INTO collection (collection_id,user_id, product_id) VALUES (NULL, 10, ?)`;

  const [result] = await db.query(sql, parseInt(pid)); //''29''
  console.log(result);
  //#region
  //ResultSetHeader {
  //fieldCount: 0,
  //affectedRows: 1,
  //insertId: 5,
  //info: '',
  //serverStatus: 2,
  //warningStatus: 0,
  //changedRows: 0
  //#endregion

  //success:!!result.affectedRows
  if (result.affectedRows) {
    const success = true;
    res.send(success);
    console.log(success);
  }
  // res.sendStatus(200);
});

//--------------------刪除收藏---------------------
productRouter.post("/del-wish", async (req, res) => {
  const pid = req.body.pid;
  console.log(pid);

  const sql = `DELETE FROM collection WHERE product_id = ${pid} AND user_id = 10`;
  //                                     ''29''

  try {
    const [result] = await db.query(sql, parseInt(pid));
    console.log(result);

    const success = !!result.affectedRows;

    console.log(success);
    res.json(success);
  } catch (ex) {
    console.log(ex);
  }
});

//--------------------新增評論---------------------
productRouter.post("/add-comment", async (req, res) => {
  const opid = req.body.opid;
  const uid = req.body.uid;
  const content = req.body.content;
  // const score = req.body.score
  const score = 4;

  const sql = `UPDATE oder_detail SET score = ${score}, content = "${content}" WHERE oder_detail.orderproduct_id = ${opid}`;
  console.log(sql);

  const [result] = await db.query(sql); //''29''
  console.log(result);
  // {
  //   fieldCount: 0,
  //   affectedRows: 1,
  //   insertId: 0,
  //   info: 'Rows matched: 1  Changed: 1  Warnings: 0',
  //   serverStatus: 2,
  //   warningStatus: 0,
  //   changedRows: 1
  // }

  //success:!!result.affectedRows
  if (result.affectedRows) {
    const success = true;
    res.send(success);
    console.log(success);
  }
  // res.sendStatus(200);
});

export default productRouter;