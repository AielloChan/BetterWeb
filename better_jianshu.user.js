// ==UserScript==
// @name         Better Jianshu
// @namespace    github.com/AielloChan/BetterWeb
// @version      1.2
// @description  Better Jianshu view
// @author       Aiello Chan
// @match        *://*.jianshu.com/*
// @grant        none
// ==/UserScript==

;(function () {
  'use strict'
  // Better Web Configur
  // ################################################################
  // better web 通用配置函数，需配合 better configurator 插件使用
  function BetterWebConfigur(config) {
    const NAMESPACE = 'BETTER_WEB'
    const configurator = window.BETTER_CONFIGURATOR
    const configuratorQuene = window.BETTER_CONFIGURATOR_QUENE || []
    if (configurator) {
      configurator(config)
    } else {
      configuratorQuene.push(config)
      window.BETTER_CONFIGURATOR_QUENE = configuratorQuene
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

  const config = BetterWebConfigur({
    name: 'BetterJianshu',
    label: 'Better 简书',
    options: [
      {
        name: 'hideHeader',
        label: '隐藏头部',
        type: 'checkbox',
        default: true,
      },
      {
        name: 'hideSidebar',
        label: '隐藏侧边栏',
        type: 'checkbox',
        default: true,
      },
      {
        name: 'fullWidth',
        label: '文章全宽',
        type: 'checkbox',
        default: true,
      },
      {
        name: 'directlyRoute',
        label: '直接跳转',
        type: 'checkbox',
        default: true,
      },
    ],
  })

  const href = location.href
  switch (true) {
    case /jianshu.com\/p/.test(href):
      // jianshu artical
      const styleNode = document.createElement('style')
      let cssFix = ''
      if (config.hideHeader) {
        cssFix += 'header{display:none !important;}' // 去掉浮动头部
      }
      if (config.hideSidebar) {
        cssFix += 'aside{display:none !important;}' // 去掉侧边栏
      }
      if (config.fullWidth) {
        cssFix += 'div[role="main"]>div {width: 100%;}' // 答案页全宽
      }
      styleNode.innerText = cssFix
      document.body.append(styleNode)
      break
    case /jianshu.com\/go-wild/.test(href):
      function getQueryVariable(name) {
        const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
        const result = window.location.search.substr(1).match(reg)
        if (result != null) {
          return decodeURI(result[2])
        } else {
          return null
        }
      }
      if (config.directlyRoute) {
        const target = getQueryVariable('url')
        if (target !== null) {
          const directLink = window.unescape(target)
          window.location.href = directLink
        }
      }
      break
  }
})()
