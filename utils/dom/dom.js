/* eslint-disable */
/* istanbul ignore next */
import Vue from 'vue';
import forge from 'node-forge'//各种加密算法插件，本项目用MD5

const isServer = Vue.prototype.$isServer;
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
const ieVersion = isServer ? 0 : Number(document.documentMode);

/* istanbul ignore next */
const trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};
/* istanbul ignore next */
const camelCase = function (name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter;
  }).replace(MOZ_HACK_REGEXP, 'Moz$1');
};

/* istanbul ignore next */
export const on = (function () {
  if (!isServer && document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

/* istanbul ignore next */
export const off = (function () {
  if (!isServer && document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();

/* istanbul ignore next */
export const once = function (el, event, fn) {
  var listener = function () {
    if (fn) {
      fn.apply(this, arguments);
    }
    off(el, event, listener);
  };
  on(el, event, listener);
};

/* istanbul ignore next */
export function hasClass (el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
};

/* istanbul ignore next */
export function addClass (el, cls) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || '').split(' ');

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName;
      }
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
};

/* istanbul ignore next */
export function removeClass (el, cls) {
  if (!el || !cls) return;
  var classes = cls.split(' ');
  var curClass = ' ' + el.className + ' ';

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ');
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
};

/* istanbul ignore next */
export const getStyle = ieVersion < 9 ? function (element, styleName) {
  if (isServer) return;
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);
  if (styleName === 'float') {
    styleName = 'styleFloat';
  }
  try {
    switch (styleName) {
      case 'opacity':
        try {
          return element.filters.item('alpha').opacity / 100;
        } catch (e) {
          return 1.0;
        }
      default:
        return (element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null);
    }
  } catch (e) {
    return element.style[styleName];
  }
} : function (element, styleName) {
  if (isServer) return;
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);
  if (styleName === 'float') {
    styleName = 'cssFloat';
  }
  try {
    var computed = document.defaultView.getComputedStyle(element, '');
    return element.style[styleName] || computed ? computed[styleName] : null;
  } catch (e) {
    return element.style[styleName];
  }
};

/* istanbul ignore next */
export function setStyle (element, styleName, value) {
  if (!element || !styleName) return;

  if (typeof styleName === 'object') {
    for (var prop in styleName) {
      if (styleName.hasOwnProperty(prop)) {
        setStyle(element, prop, styleName[prop]);
      }
    }
  } else {
    styleName = camelCase(styleName);
    if (styleName === 'opacity' && ieVersion < 9) {
      element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')';
    } else {
      element.style[styleName] = value;
    }
  }
};


/* 获取sessionStorage存储数据 */
export function getSessionCache (name) {
  if (!name) return
  return window.sessionStorage.getItem(name)
}
//设置sessionStorage存储数据
export function setSessionCache (name, content) {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.sessionStorage.setItem(name, content)
}
//删除sessionStorage存储数据
export function removeSessionCache (name) {
  if (!name) return
  window.sessionStorage.removeItem(name)
}
//获取localStorage存储数据
export function getLocalCachename (name) {
  if (!name) return
  return window.localStorage.getItem(name)
}
//设置localStorage存储数据
export function setLocalCache (name, content) {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}
//删除localStorage存储数据
export function removeLocalCache (name) {
  if (!name) return
  window.localStorage.removeItem(name)
}

export function getArray (value) {
  if (value) {
    return JSON.parse(value)
  } else {
    return []
  }
}

//对传入对象更改为查询字符串形式(加密)
export function transformParas2 (obj, shouldEncodeURI = false) {
  let arr = [];
  for (let key in obj) {
    let str = '';
    if (shouldEncodeURI) {
      str = `${encodeURIComponent(key)}=${encodeURIComponent(encodeURIComponent(obj[key]))}`;
    } else {
      str = `${key}${obj[key]}`;
    }

    arr.push(str);
  }
  return arr.join('');
}

/**
 * 根据对象属性名排序
 */
export function objKeySort (obj) {
  //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  var newkey = Object.keys(obj).sort(function (a, b) {
    var len = Math.min(a.length, b.length);
    for (var i = 0; i < len; i++) {
      var val = a.toLowerCase().charCodeAt(i) - b.toLowerCase().charCodeAt(i);
      if (val != 0) {
        return val;
      } else if (i == len - 1) {
        return a.length - b.length
      }
    }
  });
  var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
  for (var i = 0; i < newkey.length; i++) {
    //遍历newkey数组
    newObj[newkey[i]] = obj[newkey[i]];
  }
  return newObj; //返回排好序的新对象
}

//MD5加密
export function md5 (str) {
  var md = forge.md.md5.create();
  md.update(str, "utf8");
  return md.digest().toHex();
}
//获取sign：对接口内所有参数（除文件参数外）升序排序后，md5加密一次，然后再加上字符串“GXWEIXIUZHAN”再md5加密一次，形成sign
export function getSign (obj = {}) {
  // console.log(md5('thinkcar'));
  var sorttedObj = objKeySort(obj);
  var objToStr = transformParas2(sorttedObj);
  var firstEncryption = md5(objToStr + "99a2eb85f315d136f064cb7d4bcdc884");
  // var secondEncryption = md5(firstEncryption + "99a2eb85f315d136f064cb7d4bcdc884");
  return firstEncryption

}

/**
 *深度合并对象
 */
export function deepObjectMerge (FirstOBJ, SecondOBJ) {
  for (var key in SecondOBJ) {
    FirstOBJ[key] = FirstOBJ[key] && FirstOBJ[key].toString() === "[object Object]"
      ? deepObjectMerge(FirstOBJ[key], SecondOBJ[key])
      : FirstOBJ[key] = SecondOBJ[key];
  }
  return FirstOBJ;
}