type theme = "dark" | "light"

export function check_theme(): theme {
    return window && window.matchMedia('(prefers-color-scheme)').media !== 'not all' ? 'dark' : 'light'
}