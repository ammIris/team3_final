import express from "express";
import db from "../module/connect.js";
import { createLinePayClient } from "line-pay-merchant";
import util from "util";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import "dotenv/config.js";
// import cors from "cors";

const cartRouter = express.Router();

// const corsOptions = {
//   credentials: true,
//   origin: (origin, callback) => {
//     console.log({ origin });
//     callback(null, true);
//   },
// };

// ----------------------消費紀錄 my-order ----------------------
cartRouter.get("/:user_id/my-order", async (req, res) => {
  const user_id = parseInt(req.params.user_id) || 0;

  const sql = `SELECT * FROM order_general WHERE 
  user_id = ${user_id} ORDER BY order_date DESC `;

  try {
    const [rows] = await db.query(sql);
    console.log("這裡");
    console.log(rows);
    for (let r of rows) {
      r.order_date = dayjs(r.order_date).format("YYYY/MM/DD");
    }
    res.json(rows);
  } catch (ex) {
    console.log(ex);
  }
});

// ---------------------- order-complete -------------------------------
cartRouter.get("/order-complete", async (req, res) => {
  // 選出最新一筆的order_id
  const [[sql3]] = await db.query(
    `SELECT order_id FROM order_general ORDER BY order_date DESC LIMIT 1`
  );
  const sql = `SELECT * FROM order_general JOIN user on user.user_id = order_general.user_id WHERE order_general.order_id ='${sql3.order_id}' `;
  const [rows] = await db.query(sql);

  console.log(rows); // 資料型態[{order_date: 2024-04-29T04:27:14.000Z,}]
  for (let r of rows) {
    r.order_date = dayjs(r.order_date).format("YYYY/MM/DD");
  }

  console.log(rows); // [{order_date: '2024/04/29'}]
  res.json(rows);
});

//---------------------- 消費紀錄細項 order-d ----------------------
cartRouter.get("/order-d/:oid", async (req, res) => {
  let output = {
    success: false,
    result: [],
  };

  const order_id = req.params.oid;

  const sql = `SELECT * FROM order_general JOIN oder_detail ON oder_detail.order_id = order_general.order_id JOIN product ON product.product_id = oder_detail.product_id JOIN product_img ON product_img.product_id = oder_detail.product_id JOIN user ON order_general.user_id = user.user_id WHERE oder_detail.order_id LIKE '%${order_id}%' AND product_img.showed_1st=1 AND user.user_id = 22 `;
  const [result] = await db.query(sql);
  console.log(result); // [{}]
  for (let r of result) {
    r.order_date = dayjs(r.order_date).format("YYYY/MM/DD hh:mmA");
  }
  output.result = result;
  if (result.length > 0) {
    output.success = true;
  }
  res.json(output);
});

// ---------------------- 成立訂單 寫入資料庫 ---------------------------

cartRouter.post("/", async (req, res) => {
  let {
    user_id,
    payment_method,
    order_amount,
    delivery_method,
    delivery_name,
    delivery_address,
    data,
  } = req.body;

  let output = {
    success: false,
    rows: [],
  };

  const uuid = uuidv4();
  try {
    const sql = `INSERT INTO order_general(order_id, payment_status, user_id, payment_method, order_amount, delivery_method, delivery_name, delivery_phone, delivery_address, delivery_status) VALUES ('${uuid}', '已付款', ${user_id}, 'LINE PAY', ${order_amount}, '${delivery_method}', NULL, NULL, '${delivery_address}', '備貨中')`;

    const [result] = await db.query(sql);

    // 可以取得剛才新增紀錄的id流水號
    const [[sql3]] = await db.query(
      `SELECT order_id FROM order_general ORDER BY order_date DESC LIMIT 1`
    );

    // insert into 『order_detail』
    const sql2Promises = data.map((v, i) => {
      return db.query(
        `INSERT INTO oder_detail (orderproduct_id, order_id, product_id, order_quantity, score, content) VALUES (NULL, '${sql3.order_id}', ${v.product_id}, ${v.quantity}, NULL, "")`
      );
    });

    // Promise.all() --> 讓pormise.all()中的物件同時執行查詢，並在查詢完成後一次性得到結果，能更快的完成操作
    const result2Array = await Promise.all(sql2Promises);

    res.json({
      success: !!result.affectedRows,
    });
  } catch {
    (ex) => {
      console.log(ex);
    };
  }
});

// ---------------------- 寄送資訊寫入資料庫 ---------------------------

cartRouter.post("/del-detail", async (req, res) => {
  let { delivery_name, delivery_phone } = req.body;
  // let output = {
  //   success: false,
  //   rows: [],
  // };

  try {
    const [[sql3]] = await db.query(
      `SELECT order_id FROM order_general ORDER BY order_date DESC LIMIT 1`
    );
    // console.log(sql3); // { order_id: '377eaa4e-1ad0-4202-9673-3d9b52c59738' }
    // 需設條件, 不然delivery欄位全部的值都會被更改
    const sql = `UPDATE order_general SET delivery_name='${delivery_name}',delivery_phone='${delivery_phone}' WHERE 
    order_id='${sql3.order_id}'`;

    const [result] = await db.query(sql);
    console.log(result);
    // ResultSetHeader {
    //   fieldCount: 0,
    //   affectedRows: 1,
    //   insertId: 0,
    //   info: 'Rows matched: 1  Changed: 1  Warnings: 0',
    //   serverStatus: 2,
    //   warningStatus: 0,
    //   changedRows: 1
    // }
    res.json({
      success: !!result.affectedRows,
    });
  } catch {
    (ex) => {
      console.log(ex);
    };
  }
});

// --------------line pay---------

const orders = {
  body: {
    amount: 1000,
    currency: "TWD",
    orderId: "20231008004",
    packages: [
      {
        id: "8792c14f-9f63-42da-8636-0367183070cf",
        amount: 2010,
        products: [
          {
            name: "38",
            quantity: 3,
            price: 650,
          },
        ],
      },
    ],
    redirectUrls: {
      confirmUrl: "http:localhost:3002/confirm",
      cancelUrl: "http:localhost:3002/cancel",
    },
  },

  2: {
    amount: 1000,
    currency: "TWD",
    orderId: "20231008004",
    packages: [
      {
        id: "8e9a7bbd-eb0e-4849-a6fc-98ab0c1b59a9",
        amount: 2660,
        products: [
          {
            name: "38",
            quantity: 4,
            price: 650,
          },
        ],
      },
    ],
    redirectUrls: {
      confirmUrl: "http:localhost:3002/confirm",
      cancelUrl: "http:localhost:3002/cancel",
    },
  },
};

cartRouter
  .get("/", function (req, res, next) {
    res.render("index", { title: "Express" });
  })
  .get("/checkout/:id", (req, res) => {
    // 取得路由上的路徑資料
    const { id } = req.params;
    console.log(id);
    const order = orders[id];
    // 顯示出我們的訂單內容
    console.log(order);
    const order_id = parseInt(new Date().getTime() / 1000);
    orders.order_id = order_id;

    order[order.order_id] = order;
    // 把建好的訂單送到前端去
    //  res.render("checkout") --> 前端要渲染出什麼畫面出來
    // { order } --> 渲染時, 要帶什麼資料
    // 總結：把建好的訂單結構資料送到前端頁面
    res.render("checkout", { order });
  });

// create order--- 1. 建立order 2. 建立訂單給付款連結(尚未付款) 傳送line pay request API res會拿到付款連結 3. 取得付款連結, 給user做後需付款動作

// 確認付款連結應如何呈現給user, ex: button / 直接轉址導到該頁面(無須button)
// 若用button, 需要一個頁面呈現 按下create-order這api
// 跑loading, 等api完成, get response 是事件監聽, 若有值進去, 就轉導
// confirm-order -----1. 透過queryString取得order-id & transaction-ID (轉址回來會知道的參數)  2. 拿order_id到資料庫查詢, 該筆訂單的狀態（是否有該筆訂單） 需增加amount欄位 3.copy confirm API, if success 表付款完成, 需要改寫order狀態成『已付款』  付款成功！！
// app.get("/cart/create-order" 原本是這樣寫
cartRouter.get("/create-Order", async (req, res) => {
  try {
    //建立訂單
    const uuid = uuidv4();
    // const sql = `INSERT INTO order_general(order_id, payment_status, user_id, payment_method, order_amount, delivery_method, delivery_address, delivery_status, order_date) VALUES (${uuid}, '未付款', 36, 'LINE PAY', 500, '宅配', ${delivery_address}, '備貨中', now())`;
    // const [result] = await db.query(sql);
    // 把cart拿掉
    // 上課寫的 --> const sql2 = `INSERT INTO oder_detail(order_id, product_id, order_quantity) VALUES (?)`;
    const sql2 = `INSERT INTO oder_detail(order_id, product_id, order_quantity) VALUES (?) `;

    const dataToInsert = req.packages.map((idpackage) => {
      return {
        order_id: uuid,
        product_id: idpackage.id,
        order_quantity: idpackage.products[0].quantity,
      };
    });
    const [result2] = await db.query(sql2, [
      dataToInsert.map((order) => [
        order.order_id,
        order.product_id,
        order.order_quantity,
      ]),
    ]);

    const res = await createlinePayClient.request.send({
      body: req,
      //   body: {
      //     amount: 1000,
      //     currency: "TWD",
      //     orderId: "20231008004",
      //     packages: [
      //       {
      //         id: "c99abc79-3b29-4f40-8851-bc618ca57856",
      //         amount: 1000,
      //         products: [
      //           {
      //             name: "Product Name",
      //             quantity: 2,
      //             price: 500,
      //           },
      //         ],
      //       },
      //     ],
      //     redirectUrls: {
      // youtube的做法
      // confirmUrl: `${LINEPAY_RETURN_HOST} ${LINEPAY_RETURN_CONFIRM_URL}`,
      // cancelUrl:`${LINEPAY_RETURN_HOST} ${LINEPAY_RETURN_CANCEL_URL}`
      // 家教的做法
      //       confirmUrl: "http:localhost:3002/confirm",
      //       cancelUrl: "http:localhost:3002/cancel",
      //     },
      //   },
    });
    console.log(util.inspect(res, { depth: Infinity, colors: true }));
  } catch (e) {
    console.log("error", e);
  }

  res.json({
    success: !!result.affectedRows,
  });
});

// ------------------------- test linepay ------------------------

cartRouter.post("/payMethod", async (req, res) => {
  // console.log(req.body); // { uid: 22 }
  const { uid } = req.body;

  try {
    const [[sql3]] = await db.query(
      `SELECT order_id FROM order_general ORDER BY order_date DESC LIMIT 1`
    );
    const getOrderId = sql3.order_id;

    // '%${sql3.order_id}%'
    const sql = `SELECT * FROM order_general JOIN oder_detail ON oder_detail.order_id = order_general.order_id JOIN product ON product.product_id = oder_detail.product_id JOIN product_img ON product_img.product_id = oder_detail.product_id JOIN user ON order_general.user_id = user.user_id WHERE oder_detail.order_id = '${getOrderId}' AND product_img.showed_1st=1 AND user.user_id = '${uid}'`;
    const [result] = await db.query(sql); // 得到 [{資料庫中所需的資料}]

    // 格式化 packages 1-1
    function formatData(result) {
      return [
        {
          id: result[0].order_id,
          amount: result[0].order_amount,
          products: result.map((v, i) => ({
            name: v.product_name,
            quantity: v.order_quantity,
            price: v.price,
          })),

          // [
          //   {
          //     name: result[0].product_name,
          //     quantity: result[0].order_quantity,
          //     price: result[0].price,
          //   },
          // ],
        },
      ];
    }
    // 格式化 packages 1-2
    const formattedData = formatData(result);

    // console.log(), 使用JSON.stringify, 因若不用json.stringify, 它可能以[Object]的形式顯示，而不是展開嵌套對象的詳細內容。這是一種簡化的表示方法，防止在控制台中顯示大量的嵌套數據。
    // console.log(JSON.stringify(formattedData, null, 2));

    // 簽章
    const linePayClient = createLinePayClient({
      channelId: "2001065647",
      channelSecretKey: "5325621a629813e1a10602cc06f96db5",
      env: "development",
    });

    // 送出 Line Pay request
    const toLine = await linePayClient.request.send({
      body: {
        amount: result[0].order_amount,
        currency: "TWD",
        orderId: result[0].order_id,
        packages: formattedData,
        redirectUrls: {
          // confirmUrl: `${LINEPAY_RETURN_HOST} ${LINEPAY_RETURN_CONFIRM_URL}`,
          // cancelUrl: `${LINEPAY_RETURN_HOST} ${LINEPAY_RETURN_CANCEL_URL}`,
          // confirmUrl : LINE Pay Server向Merchant Server請求confirmUrl
          confirmUrl: "http:localhost:3080/cart/order-complete",
          cancelUrl: "linePay/cancel",
        },
      },
    });
    // util.inspect --> 物件轉字串
    console.log(util.inspect(toLine, { depth: Infinity, colors: true }));

    // cors問題
    // router.use(cors(corsOptions));
    // solution 2
    // 如果請求成功, 回傳sandbox網址
    // 使用可選串連 --> 『?.』 因line pay回覆結構每次不相同, 使用站位運算符讓我們在讀取深度嵌套的對象屬性時，不必明確檢查每一個層級是否存在。如果某個層級不存在，它會返回 undefined，而不會拋出錯誤
    if (toLine?.body?.returnCode === "0000") {
      const aaa = toLine?.body?.info?.paymentUrl?.web;
      res.json(aaa);
    }
  } catch (e) {
    console.log("error", e);
  }
});

// --------------confirm--------------------------

cartRouter.get("/order-complete/:transactionId/:orderId", async (req, res) => {
  const [[sql3]] = await db.query(
    `SELECT order_amount FROM order_general ORDER BY order_date DESC LIMIT 1`
  );

  const orderAmount = sql3.order_amount;
  // 將transactionId=20240506取代成20240506
  const tran = req.params.transactionId.replace("transactionId=", "");
  // 簽章
  const linePayClient = createLinePayClient({
    channelId: "2001065647",
    channelSecretKey: "5325621a629813e1a10602cc06f96db5",
    env: "development",
  });

  try {
    const lastLine = await linePayClient.confirm.send({
      transactionId: tran,
      body: {
        currency: "TWD",
        // amount需要查資料庫的訂單
        amount: orderAmount,
      },
    });
    console.log("==================success==============");
    console.log(util.inspect(lastLine, { depth: Infinity, colors: true }));
  } catch (e) {
    console.log("error", e);
  }
});

// -------------------------------- 7-11 ----------------------------------------
const callback_url = process.env.SHIP_711_STORE_CALLBACK_URL;

// POST
cartRouter.post("/711", function (req, res, next) {
  // console.log(req.body);
  //   storeid: '126616',
  // storename: '立行門市',
  // storeaddress: '新北市三重區力行路二段158號160號',
  // outside: '0',
  // ship: '1111111',
  // TempVar: ''
  let searchParams = new URLSearchParams(req.body);
  res.redirect(callback_url + "?" + searchParams.toString());
});

// -------------------------------- 願望清單 --------------------------------

cartRouter.post("/wishList", async (req, res) => {
  const pid = req.body.pid;
  const uid = req.body.uid;

  const sql = `INSERT INTO collection (collection_id,user_id, product_id) VALUES (NULL, ${parseInt(
    uid
  )}, ${parseInt(pid)})`;

  const [result] = await db.query(sql);
  // console.log(result); 是object
  // result 長這樣
  // ResultSetHeader {
  //   fieldCount: 0,
  //   affectedRows: 1,
  //   insertId: 153,
  //   info: '',
  //   serverStatus: 2,
  //   warningStatus: 0,
  //   changedRows: 0}
  if (result.affectedRows) {
    const success = true;
    res.send(success);
  }
});

export default cartRouter;
