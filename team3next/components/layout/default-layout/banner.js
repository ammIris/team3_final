import Link from "next/link";
import React from "react";

export default function Banner() {
  return (
    <>
      <div className="w-100 h400 d-flex align-items-end banner pb-5">
        <div className="container d-flex justify-content-center">
          <div className="dropdown ms-5 pe-4">
            {/* 下拉選單 */}
            <button
              className="btn dropdown-toggle btn-lg"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false">
              不分地區
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="#/">
                  台北市
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#/">
                  桃園市
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#/">
                  高雄市
                </a>
              </li>
            </ul>
          </div>
          {/* 搜尋條 */}
          <form className="d-flex" role="search">
            <table>
              <tr>
                <td>
                  <input
                    className="form-control me-2 searchbar ps-4"
                    type="search"
                    placeholder="輸入「早午餐」或「甜點」找尋美食!"
                    aria-label="Search"></input>
                </td>
                <td className="position-relative">
                  <span className="icon-search position-absolute" style={{ right: 30, cursor: 'pointer', zIndex: 100,top:21}}></span>
                </td>
              </tr>
            </table>
          </form>
        </div>
      </div>

      <style global jsx>
        {`
          .h400 {
            height: 400px;
          }
          .searchbar {
            width: 655px;
            height: 60px;
            border-radius: 40px;
          }
          .banner {
            background-image: url("./images/index-image.jpg");
            background-size: cover;
          }
        `}
      </style>
    </>
  );
}
