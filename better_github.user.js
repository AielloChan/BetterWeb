// ==UserScript==
// @name         Better Github
// @namespace    github.com/AielloChan/BetterWeb
// @version      1.0
// @description  Better Github view
// @author       Aiello Chan
// @match        *://*.github.com/*/*
// @grant        none
// ==/UserScript==

(async function () {
  "use strict";
  // Better Web Configure
  // ################################################################
  // better web 通用配置函数，需配合 better configurator 插件使用
  function BetterWebConfigure(config) {
    const NAMESPACE = "BETTER_WEB";
    const configurator = window.BETTER_CONFIGURATOR;
    const configuratorQueue = window.BETTER_CONFIGURATOR_QUEUE || [];
    if (configurator) {
      configurator(config);
    } else {
      configuratorQueue.push(config);
      window.BETTER_CONFIGURATOR_QUEUE = configuratorQueue;
    }
    const value = localStorage.getItem(`${NAMESPACE}_${config.name}`);
    const localValue = JSON.parse(value) || {};
    config.options.forEach((opt) => {
      if (localValue[opt.name] === undefined) {
        localValue[opt.name] = opt.default;
      }
    });
    return localValue;
  }
  // ################################################################

  const config = BetterWebConfigure({
    name: "BetterGithub",
    label: "Better Github",
    options: [
      {
        name: "gitpod",
        label: "支持 gitpod",
        type: "checkbox",
        default: true,
      },
    ],
  });

  function idleSleep() {
    return new Promise((r) => requestIdleCallback(r));
  }
  async function waitFor(query, timeout) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const result = query();
      if (result) {
        return result;
      }
      await idleSleep();
    }
    return null;
  }

  const href = location.href;

  if (config.gitpod) {
    const nav = await waitFor(() =>
      document.querySelector(".file-navigation", 10 * 1e3)
    );
    if (nav) {
      const btn = nav.querySelector("#gitpod-btn-container");
      if (!btn) {
        const a = document.createElement("a");
        a.id = "gitpod-btn-nav";
        a.href = `https://gitpod.io/#${href}`;
        a.target = "_blank";
        a.className = "btn btn-primary";
        a.textContent = "Gitpod";
        const container = document.createElement("div");
        container.id = "gitpod-btn-container";
        container.className =
          "empty-icon position-relative gitpod-nav-btn float-right";
        container.appendChild(a);
        nav.appendChild(container);
      }
    }
  }
})();
