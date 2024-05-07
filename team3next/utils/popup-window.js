// 開新視窗並置中於瀏覽器中央的函式，facebook use it
// https://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen
export function popupCenter(url, title, w, h) {
  //  主要是用來獲取當前瀏覽器的用戶代理（User-Agent）字符串。用戶代理字符串包含了關於當前瀏覽器和操作系統的信息，通常會被用於識別瀏覽器的類型和版本
  var userAgent = navigator.userAgent,
    mobile = function () {
      return (
        // 檢測當前設備是否為移動設備
        // \b: \b 這個單詞邊界『確保匹配的是完整的單詞』，而不是字串中的一部分
        // | : 在正規表達式中, 表示邏輯上的『或』
        // [] : 表示匹配任一其中的字母
        // 補充：|| 在Javascript中,表示邏輯上的『或』
        /\b(iPhone|iP[ao]d)/.test(userAgent) ||
        /\b(iP[ao]d)/.test(userAgent) ||
        /Android/i.test(userAgent) ||
        // i : 正規表達式中，ｉ代表不區分字母大小寫
        // 表示在 userAgent 字符串中测试是否存在 "Mobile"（不区分大小写），如果存在则返回 true，否则返回 false
        /Mobile/i.test(userAgent)
      );
    },
    screenX =
      // typeof已被定義 --> 返回該資料型態 /  未被定義--> 返回undefined
      typeof window.screenX != "undefined" ? window.screenX : window.screenLeft,
    screenY =
      typeof window.screenY != "undefined" ? window.screenY : window.screenTop,
    outerWidth =
      typeof window.outerWidth != "undefined"
        ? window.outerWidth
        : document.documentElement.clientWidth,
    outerHeight =
      typeof window.outerHeight != "undefined"
        ? window.outerHeight
        : document.documentElement.clientHeight - 22,
    targetWidth = mobile() ? null : w,
    targetHeight = mobile() ? null : h,
    // 確保彈出視窗在屏幕上的水平位置是正確的
    V = screenX < 0 ? window.screen.width + screenX : screenX,
    left = parseInt(V + (outerWidth - targetWidth) / 2, 10),
    right = parseInt(screenY + (outerHeight - targetHeight) / 2.5, 10),
    // feature是一個, 視窗特性描述的陣列
    features = [];
  if (targetWidth !== null) {
    features.push("width=" + targetWidth);
  }
  if (targetHeight !== null) {
    features.push("height=" + targetHeight);
  }
  features.push("left=" + left);
  features.push("top=" + right);
  features.push("scrollbars=1");

  // 用於在新的瀏覽器視窗中, 載入指定的URL
  // window.open 函數的第三個參數，該參數需要字串，而不是陣列。因此使用 join 將這些特性描述組合成一個字串，以符合 window.open 函數的要求
  var newWindow = window.open(url, title, features.join(","));

  if (window.focus) {
    newWindow.focus();
  }

  return newWindow;
}

// 自訂事件用               要訂閱的事件名稱 / 事件處理函數
export function subscribe(eventName, listener) {
  // 當指定的事件被觸發時，指定的事件處理函數將被執行
  document.addEventListener(eventName, listener);
}

// 自訂事件用
export function unsubscribe(eventName, listener) {
  document.removeEventListener(eventName, listener);
}

// 自訂事件用
export function publish(eventName, data) {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
}

// call and close popwindow
// default is window
// export function closeWindow(windowRef = window) {
//   windowRef.opener = null
//   windowRef.open('', '_self')
//   windowRef.close()
//   //top.close()
//   setTimeout(window.close, 5000)
//   windowRef.history.go(-1)
//   document.body.hide()
//   window.open('', '_parent', '')
//   window.close()
// }
