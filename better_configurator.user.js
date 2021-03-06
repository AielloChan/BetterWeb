// ==UserScript==
// @name         Better Configurator
// @namespace    github.com/AielloChan/BetterWeb
// @version      1.2
// @description  Better Web Plugins' Uni-Configurator
// @author       Aiello Chan
// @match        *://*/*
// @grant        none
// ==/UserScript==

;(function (window) {
  'use strict'
  const IS_IFRAME = window.self !== window.top
  if (IS_IFRAME) {
    return
  }

  const NAMESPACE = 'BETTER_WEB'
  const createElement = document.createElement.bind(document)
  const style = createElement('style')
  style.innerHTML = `
    .${NAMESPACE}__container{
      position: fixed;
      z-index: 999;
      box-sizing: border-box;
      background: #f6f6f6;
      right: -150px;
      top: 50px;
      width: 150px;
      border: 1px solid #d3d3d3;
      border-right: 0;
      border-radius: 5px;
      padding: 5px;
      transition: right 600ms cubic-bezier(.22,.69,.2,1.03);
    }
    .${NAMESPACE}__container ol, .${NAMESPACE}__container ul {
      padding-left: 10px;
      margin: 0;
      list-style: none;
    }
    .${NAMESPACE}__bar{
      position: absolute;
      background: #f6f6f6;
      border-radius: 3px 0 0 3px;
      border: 1px solid #d3d3d3;
      border-right: 0;
      width: 5px;
      left: -5px;
      height: 30px;
      z-index: 2;
    }
    .${NAMESPACE}__container:hover{
      right: 0;
    }
    `
  document.body.append(style)

  function readConfig(pluginName) {
    const value = localStorage.getItem(`${NAMESPACE}_${pluginName}`)
    return JSON.parse(value) || {}
  }
  function writeConfig(pluginName, key, value) {
    const config = readConfig(pluginName)
    config[key] = value
    localStorage.setItem(`${NAMESPACE}_${pluginName}`, JSON.stringify(config))
  }

  function makeNodeListFromConfig(configs) {
    const pluginName = configs.name
    const options = configs.options
    const config = readConfig(pluginName)
    /**
     * config
     * [{
     * name:"",
     * label:"",
     * type:"", // checkbox
     * default:"", // bool
     * }]
     *
     */
    return options.map((cfg) => {
      switch (cfg.type) {
        case 'checkbox':
          var label = createElement('label')
          var input = createElement('input')
          var curValue = config[cfg.name]
          label.innerHTML = cfg.label
          label.prepend(input)
          input.type = 'checkbox'
          input.checked = curValue === undefined ? cfg.default : curValue

          input.onclick = function () {
            writeConfig(pluginName, cfg.name, input.checked)
          }
          return label
      }
    })
  }

  const configurator = function (config) {
    const pluginName = config.name
    const pluginLabel = config.label
    const options = config.options
    let container = document.querySelector('#' + pluginName)
    if (!container) {
      container = createElement('div')
      container.id = NAMESPACE
      container.className = `${NAMESPACE}__container`
      container.innerHTML = `<div class="${NAMESPACE}__bar"></div>`
      document.body.append(container)
    }
    container.innerHTML += `<strong>${pluginLabel}</strong><br/>`
    const listContainer = createElement('ul')
    container.appendChild(listContainer)
    makeNodeListFromConfig(config).forEach((node) => {
      const li = createElement('li')
      li.appendChild(node)
      listContainer.appendChild(li)
    })
  }
  window.BETTER_CONFIGURATOR = configurator

  const quene = window.BETTER_CONFIGURATOR_QUENE || []
  quene.forEach((cfg) => configurator(cfg))
})(window)
