import { useState, useEffect } from "react";
import styles from "./cart-detail.module.css";
import MyNavbar from "@/components/layout/default-layout/navbar-main/index";
import Footer from "@/components/layout/default-layout/footer";

export default function CartDetail() {
  return (
    <>
      <MyNavbar />

      {/* 購物進度條 */}
      <div className={styles.sectionBar + " mt-5"}>
        {/* <div className="w-75 d-flex justify-content-between"> */}
        <a href="" className={styles.firstStep}>
          <p className="text-start">顧客</p>
        </a>

        <div className={styles.step}>
          <p className="text-start">配送</p>
        </div>

        <div className={styles.step}>
          <p className="text-start">付款</p>
        </div>

        <div className={styles.lastStep}>
          <p className="text-start">檢視</p>
        </div>

        {/* </div> */}
      </div>

      {/* 購物車細項 -- START */}
      <div className={styles.cartContainer + " container mt-2"}>
        {/* <div className="fs-6">購物車(1)</div> */}
        <table className={styles.cutBorder + " table"}>
          <thead>
            {/* 若購物車要對齊 className={styles.productTitle + " border-0"} */}
            <tr>
              <th scope="col" className={styles.cartNum + " border-0"}>
                購物車(1)
              </th>
            </tr>
            <tr className={styles.productTitle}>
              <th scope="col">商品資訊</th>
              <th scope="col"></th>
              <th scope="col">數量</th>
              <th scope="col">單價</th>
              <th scope="col">小計</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.productDetail + " container"}>
              <td className={styles.imgWidth + " w-20"}>
                <img
                  className="img-fluid rounded-1"
                  src="https://rs.joo.com.tw/website/uploads_product/website_1060/P0106000282607_3_1674263.jpg?_4431"
                  alt=""
                />
              </td>
              <td className={styles.cutBorder + " align-middle"}>
                【檸檬大叔】100%純檸檬磚(12入/盒)
              </td>
              <td className={styles.cutBorder + " align-middle"}>
                <span className="icon-minus me-3"></span>1
                <span className="icon-plus ms-3"></span>
              </td>
              <td className={styles.cutBorder + " align-middle"}>NT$320</td>
              <td className={styles.cutBorder + " align-middle"}>NT$320</td>
            </tr>

            <tr className="container">
              <td>移至願望清單</td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <span className="icon-trash d-flex justify-content-end"></span>
              </td>
            </tr>
          </tbody>
        </table>

        <div className={styles.delAllContent + " d-flex my-5"}>
          <div className={styles.delContent + " w-50"}>
            <span>配送方式</span>
            {/* select外面包form是為了要做驗證, 送出表單 */}
            <div>
              <select className={styles.delWay + " mt-1"}>
                <option selected required>
                  請選擇運送方式
                </option>
                <option value="1">宅配</option>
                <option value="2">7-11超商取貨</option>
              </select>
            </div>
          </div>

          {/* 總額計算 */}
          <div className="w-100 d-flex justify-content-end">
            <div className="w-25">
              <div className="row">
                <div className="col-6">小計</div>
                <div className="col-6">NT$320</div>
                <div className="col-6 py-2">運費</div>
                <div className="col-6 py-2">NT$60</div>
                <div className="col-6 pt-2 border-top">總計</div>
                <div className="col-6 pt-2 border-top">NT$380</div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mt-5">
          <div className="row">
            <div className="col-12">※ 提醒您：</div>
            <div className="col-12">
              當包裹送達您指定之7-11門市時，隔日將會發送簡訊到貨通知。門市純取貨之訂單，收件人務必填寫與身分證上相符的姓名，並攜帶證件至門市領取包裹
            </div>
          </div>
        </div>

        <a href="/cart/del-detail" className={styles.linkText}>
          <div className="d-flex justify-content-center">
            <button className="btn btn-middle mt-5 mb-5">前往結帳</button>
          </div>
        </a>
      </div>
      <Footer />
    </>
  );
}
