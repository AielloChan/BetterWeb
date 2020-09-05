// ==UserScript==
// @name         Better Lanzou
// @namespace    github.com/AielloChan/BetterWeb
// @version      1.5
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
  async function waitFor(job, interval = 200, timeout = 3e3) {
    if (!job || !(job instanceof Function)) {
      throw new Error('job should be a function: ' + job)
    }
    const deadline = +new Date() + timeout
    let timer = null
    while (true) {
      const result = job()
      if (result) {
        return result
      } else if (+new Date() > deadline) {
        // timeout
        throw new Error('polling query timeout: ' + selector)
      } else {
        await delay(interval)
      }
    }
  }
  async function pollingQuery(selector, interval, timeout) {
    return await waitFor(
      () => document.querySelector(selector),
      interval,
      timeout,
    )
  }

  const IS_IFRAME = window.self !== window.top

  switch (true) {
    case /.*\.lanzou[x|s].com\/[^\/]+/.test(location.href):
      if (!IS_IFRAME) {
        // base page
        pollingQuery('iframe.n_downlink')
          .then((iframe) =>
            waitFor(() => iframe.contentDocument.querySelector('#go>a')),
          )
          .then((el) => {
            location.href = el.href
          })
          .catch((err) => {
            console.log('open download link failed: ', err.message)
          })
      }
      break
    case /baidupan.com/.test(location.href):
      // download page
      pollingQuery('#load2[style="display: none;"]')
        .then(() => pollingQuery('#sub>div'))
        .then((el) => {
          el.click()
          return pollingQuery('#go>a')
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
          console.log('failed: ', err.message)
        })
      break
  }
})()
