// ==UserScript==
// @name         Better Configurator
// @namespace    github.com/AielloChan/BetterWeb
// @version      0.1
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
  const style = document.createElement('style')
  style.innerText = `
    .${NAMESPACE}__container{
      position: fixed;
      z-index: 999;
      background: #f6f6f6;
      right: -161px;
      top: 50px;
      width: 150px;
      border: 1px solid #d3d3d3;
      border-right: 0;
      border-radius: 5px;
      padding: 5px;
      transition: right 600ms cubic-bezier(.22,.69,.2,1.03);
    }
    .${NAMESPACE}__bar{
      position: absolute;
      background: #f6f6f6;
      border-radius: 3px 0 0 3px;
      border: 1px solid #d3d3d3;
      border-right: 0;
      width: 5px;
      left: -6px;
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

  function makeNodeFromConfig(configs) {
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
          var label = document.createElement('label')
          var input = document.createElement('input')
          var curValue = config[cfg.name]
          label.innerText = cfg.label
          label.appendChild(input)
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
      container = document.createElement('div')
      container.id = NAMESPACE
      container.className = `${NAMESPACE}__container`
      container.innerHTML = `<div class="${NAMESPACE}__bar"></div>`
      document.body.append(container)
    }
    container.innerHTML += `<strong>${pluginLabel}</strong><br/>`
    makeNodeFromConfig(config).forEach((node) => {
      container.appendChild(node)
      container.appendChild(document.createElement('br'))
    })
  }
  window.BETTER_CONFIGURATOR = configurator

  const quene = window.BETTER_CONFIGURATOR_QUENE || []
  quene.forEach((cfg) => configurator(cfg))
})(window)
