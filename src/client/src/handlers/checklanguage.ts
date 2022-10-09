import { config } from '../config/default'

export function check_language() {
    let systemLang = window.navigator.language || navigator.language
    if (systemLang && config.languages.find(l => systemLang.includes(l[0]))) {
        let l = config.languages.find(l => systemLang.includes(l[0]))
        return l ? l[0] : null
    }
    return null
}