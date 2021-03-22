// ==UserScript==
// @name         Better ZhiHu
// @namespace    github.com/AielloChan/BetterWeb
// @version      1.6
// @description  Better ZhiHu view
// @author       Aiello Chan
// @match        *://*.zhihu.com/*
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
    name: 'BetterZhihu',
    label: 'Better 知乎',
    options: [
      {
        name: 'resetTitle',
        label: '重置标题',
        type: 'checkbox',
        default: true,
      },
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
        label: '回答全宽',
        type: 'checkbox',
        default: true,
      },
      {
        name: 'removeLoginAlert',
        label: '去掉登陆提示',
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
    case /www.zhihu.com\/(question|search|hot|follow|signin|)/.test(href):
      // @match        *://www.zhihu.com/question/*
      // @match			   *://www.zhihu.com/search/*
      // @match			   *://www.zhihu.com/hot
      // @match			   *://www.zhihu.com/follow
      // @match			   *://www.zhihu.com/
      // @match        *://www.zhihu.com/signin*
      const styleNode = document.createElement('style')
      if (config.resetTitle) {
        setTimeout(function () {
          document.title = '知乎'
        }, 3e3)
      }

      let cssFix = '.Post-content {min-width: auto !important;}'
      if (config.fullWidth) {
        cssFix += '.Question-mainColumn {width: 100%;}' // 答案页全宽
      }
      if (config.hideHeader) {
        cssFix += 'header{display:none !important;}' // 去掉浮动头部
      }
      if (config.hideSidebar) {
        cssFix += '.Question-sideColumn--sticky{display:none !important;}' // 去掉侧边栏
      }
      if (config.removeLoginAlert) {
        cssFix +=
          'html{overflow:auto !important;} ' +
          '.Modal-wrapper {display:none !important;}' // 干掉登陆提示
      }

      styleNode.innerText = cssFix
      document.body.append(styleNode)
      break
    case /link.zhihu.com/.test(href):
      // @match        *://link.zhihu.com/*
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
        const target = getQueryVariable('target')
        if (target !== null) {
          const directLink = window.unescape(target)
          window.location.href = directLink
        }
      }
      break
  }
})()
