// ==UserScript==
// @name         Better lanzou
// @namespace    github.com/AielloChan/BetterWeb
// @version      0.5
// @description  auto download lanzou file
// @author       Aiello Chan
// @match        *://www.lanzoux.com/*
// @match        *://*.lanzous.com/*
// @match        *://*.baidupan.com/*
// @grant        none
// ==/UserScript==

// 轮询节点
function pollingQuery(selector, interval, timeout) {
  const deadline = +new Date() + timeout
  let timer = null
  return new Promise((resolve, reject) => {
    function query() {
      const result = document.querySelector(selector)
      if (result) {
        resolve(result)
        if (timer) {
          window.clearTimeout(timer)
          timer = null
        }
      } else if (+new Date() > deadline) {
        // timeout
        reject()
      } else {
        timer = setTimeout(query, interval)
      }
    }
    query()
  })
}

;(function () {
  'use strict'
  console.log('script started')

  switch (true) {
    case /.*\.lanzou[x|s].com\/[^\/]+/.test(location.href):
      // base page
      pollingQuery('#go>a', 200, 3 * 1000)
        .then((el) => {
          console.log(el.href)
          location.href = el.href
        })
        .catch(() => {
          console.log('failed')
        })
      break
    case /baidupan.com/.test(location.href):
      // download page
      pollingQuery('#sub>div', 200, 3 * 1000)
        .then((el) => {
          console.log(el.text)
          setTimeout(() => {
            el.click()
            pollingQuery('#go>a', 200, 3 * 1000)
              .then((el) => {
                console.log(el.href)
                el.click()
              })
              .catch(() => {
                console.log('failed')
              })
          }, 3e3)
        })
        .catch(() => {
          console.log('failed')
        })

      break
  }
})()
