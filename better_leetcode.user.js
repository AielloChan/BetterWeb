// ==UserScript==
// @name         Better LeetCode
// @namespace    github.com/AielloChan/BetterWeb
// @version      1.2
// @description  Better LeetCode view
// @author       Aiello Chan
// @match        *://*.leetcode.com/*
// @grant        none
// ==/UserScript==

; (function () {
  'use strict'
  // Better Web Configure
  // ################################################################
  // better web 通用配置函数，需配合 better configurator 插件使用
  function BetterWebConfigure(config) {
    const NAMESPACE = 'BETTER_WEB'
    const configurator = window.BETTER_CONFIGURATOR
    const configuratorQueue = window.BETTER_CONFIGURATOR_QUEUE || []
    if (configurator) {
      configurator(config)
    } else {
      configuratorQueue.push(config)
      window.BETTER_CONFIGURATOR_QUEUE = configuratorQueue
    }
    const value = localStorage.getItem(`${NAMESPACE}_${config.name}`)
    const localValue = JSON.parse(value) || {}
    config.options.forEach((opt) => {
      if (localValue[opt.name] === undefined) {
        localValue[opt.name] = opt.default
      }
    })
    return localValue
  }
  // ################################################################

  const config = BetterWebConfigure({
    name: 'BetterLeetCode',
    label: 'Better LeetCode',
    options: [
      {
        name: 'hideCnBanner',
        label: '隐藏中文版提示',
        type: 'checkbox',
        default: true,
      },
    ],
  })

  const styleNode = document.createElement('style')
  let cssFix = ''
  if (config.hideCnBanner) {
    cssFix += '#cn-banner{display:none !important;}' // 隐藏中文版提示
  }
  styleNode.innerText = cssFix
  document.body.append(styleNode)
})()
