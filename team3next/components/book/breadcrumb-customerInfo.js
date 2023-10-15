import React from "react";
import styles from "@/pages/product/index.module.css";

export default function BreadcrumbCustomerInfo({ restaurant_name }) {
  return (
    <>
      <div className={styles.bread} style={{ paddingLeft: "0px" }}>
        <span className="icon-home"></span>
        <span className="icon-arrow-s-right"></span>
        <span>
          <a href="#">食在推</a>
        </span>
        <span className="icon-arrow-s-right"></span>
        <span>
          <a href="#">{restaurant_name}</a>
        </span>
        <span className="icon-arrow-s-right"></span>
        <span>
          <a href="#">訂位人資料</a>
        </span>
        {/* <nav
          // style={{--bs-breadcrumb-divider= '>'}}
          aria-label="breadcrumb"
        >
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#" className="icon-home"></a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              台北市
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              義式
            </li>
          </ol>
        </nav> */}
      </div>
    </>
  );
}
