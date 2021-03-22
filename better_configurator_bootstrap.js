// Author: Aiello Chan <aiello.chan@gmail.com>
// Version: 1.0
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