// ==UserScript==
// @name         Better ZhiHu
// @namespace    github.com/AielloChan/BetterWeb
// @version      1.1
// @description  Better ZhiHu view
// @author       Aiello Chan
// @match        *://www.zhihu.com/question/*
// @match			   *://www.zhihu.com/search*
// @match			   *://www.zhihu.com/hot
// @match			   *://www.zhihu.com/follow
// @match			   *://www.zhihu.com/
// @match        *://www.zhihu.com/signin*
// @grant        none
// ==/UserScript==

;(function () {
  'use strict'
  const styleNode = document.createElement('style')

  setTimeout(function () {
    document.title = '知乎'
  }, 3e3)

  let cssFix = ''
  cssFix += '.Question-mainColumn{width:auto;}' // 答案页全宽
  cssFix += 'header,.Question-sideColumn--sticky{display:none !important;}' // 去掉浮动头部
  cssFix +=
    'html{overflow:auto !important;} .Modal-backdrop,.signFlowModal{display:none !important;}' // 干掉登陆提示

  styleNode.innerText = cssFix
  document.body.append(styleNode)
})()
