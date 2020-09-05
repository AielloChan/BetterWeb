// ==UserScript==
// @name         Better lanzou
// @namespace    github.com/AielloChan/BetterWeb
// @version      1.0
// @description  auto download lanzou file
// @author       Aiello Chan
// @match        *://www.lanzoux.com/*
// @match        *://*.lanzous.com/*
// @match        *://*.baidupan.com/*
// @grant        none
// ==/UserScript==

;(function () {
  'use strict'

  function delay(t) {
    return new Promise((r) => setTimeout(r, t))
  }

  // 轮询节点
  async function pollingQuery(selector, interval, timeout) {
    const deadline = +new Date() + timeout
    let timer = null
    while (true) {
      const result = document.querySelector(selector)
      if (result) {
        return result
      } else if (+new Date() > deadline) {
        // timeout
        throw new Error('polling query timeout')
      } else {
        await delay(interval)
      }
    }
  }

  const IS_IFRAME = window.self !== window.top

  switch (true) {
    case /.*\.lanzou[x|s].com\/[^\/]+/.test(location.href):
      if (IS_IFRAME) {
        // base page
        pollingQuery('#go>a', 200, 3 * 1000)
          .then((el) => {
            window.open(el.href)
            const fileNameNode = window.parent.document.querySelector(
              '#filenajax',
            )
            const message = ` 
              <div style="text-align: center; margin-top: 10vh;">
                <div style="color: crimson;">${fileNameNode.innerText}</div>
                <br/> <br/>
                <div style="font-size: 1.5em; font-weight: bold;">已成功开始下载，可关闭此窗口</div>
                <br/>
                <small style="color: lightgray;">由于安全原因，程序无法自动关闭此页面，请您手动关闭即可</small>
              </div>`
            window.parent.document.body.innerHTML = message
          })
          .catch((err) => {
            console.log('open download link failed', err.message)
          })
      }
      break
    case /baidupan.com/.test(location.href):
      // download page
      pollingQuery('#load2[style="display: none;"]', 200, 3 * 1000)
        .then(pollingQuery.bind(null, '#sub>div', 200, 3 * 1000))
        .then((el) => {
          el.click()
          return pollingQuery('#go>a', 200, 3 * 1000)
        })
        .then((el) => {
          window.open(el.href, '_self')
          const message = document.createElement('div')
          message.style =
            'font-size: 24px; text-align: center; color: crimson; margin-top: 10vh;'
          document.body.prepend(message)
          async function countdown() {
            for (let i = 5; i > 0; i--) {
              message.innerText = `下载已经开始，${i} 秒后本窗口将自动关闭`
              await delay(1e3)
            }
            return window.close()
          }
          return countdown()
        })
        .catch((err) => {
          console.log('failed', err.message)
        })
      break
  }
})()
