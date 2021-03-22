// Author: Aiello Chan <aiello.chan@gmail.com>
// Version: 1.1
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
window.BetterWebConfigure = BetterWebConfigure