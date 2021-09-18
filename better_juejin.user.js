// ==UserScript==
// @name         Better Juejin
// @namespace    github.com/AielloChan/BetterWeb
// @version      1.3
// @description  Better Juejin view
// @author       Aiello Chan
// @match        *://juejin.im/post/*
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
    name: 'BetterJuejin',
    label: 'Better 掘金',
    options: [
      {
        name: 'fullWidth',
        label: '文章全宽',
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
        name: 'hideRecommend',
        label: '隐藏推荐',
        type: 'checkbox',
        default: true,
      },
    ],
  })

  const styleNode = document.createElement('style')

  let cssFix = ''
  if (config.fullWidth) {
    cssFix += '.article-area {width: auto !important;}' // 答案页全宽
  }
  if (config.hideSidebar) {
    cssFix += '.sidebar {display: none !important;}' // 隐藏侧边栏
  }
  if (config.hideRecommend) {
    cssFix += '.recommend-box {display: none !important;}' // 隐藏推荐
  }

  styleNode.innerText = cssFix
  document.body.append(styleNode)
})()
