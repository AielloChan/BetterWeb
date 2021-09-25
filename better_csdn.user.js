// ==UserScript==
// @name         Better CSDN
// @namespace    github.com/AielloChan/BetterWeb
// @version      1.2
// @description  Better CSDN view
// @author       Aiello Chan
// @match        *://blog.csdn.net/*
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
    name: 'BetterCSDN',
    label: 'Better CSDN',
    options: [
      {
        name: 'enableCopy',
        label: '开启复制',
        type: 'checkbox',
        default: true,
      },
      {
        name: 'closeLogin',
        label: '关闭登录提示',
        type: 'checkbox',
        default: true,
      },
      {
        name: 'closeToolbar',
        label: '关闭工具栏',
        type: 'checkbox',
        default: true,
      },
      {
        name: 'closeToolbarAds',
        label: '关闭工具栏广告',
        type: 'checkbox',
        default: true,
      },
      {
        name: 'closeSidebarAds',
        label: '关闭侧边栏广告',
        type: 'checkbox',
        default: true,
      },
    ],
  })

  function idleSleep() {
    return new Promise(r => requestIdleCallback(r))
  }
  async function waitFor(query, timeout) {
    const startTime = Date.now()
    while (Date.now() - startTime < timeout) {
      const result = query()
      if (result) {
        return result
      }
      await idleSleep()
    }
    return null
  }

  const href = location.href
  const styleNode = document.createElement('style')

  let cssFix = ''
  if (config.enableCopy) {
    cssFix += '* {user-select: auto !important;} .signin {display: none !important;}' // 允许复制
  }
  if (config.closeLogin) {
    cssFix += ".passport-login-container {display: none !important;}"
  }
  if (config.closeToolbar) {
    cssFix += "#toolbar {display: none !important;}"
  }
  if (config.closeToolbarAds) {
    cssFix += ".toolbar-advert {display: none !important;}"
  }
  if (config.closeSidebarAds) {
    cssFix += ".csdn-common-logo-advert {display: none !important;}"
  }

  styleNode.innerText = cssFix
  document.body.append(styleNode)
})()
