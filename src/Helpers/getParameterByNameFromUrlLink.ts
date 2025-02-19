export const getParameterByNameFromUrlLink = (name: string, url = window.location.href) => {
    // Экранируем специальные символы в имени параметра
    // eslint-disable-next-line no-useless-escape
    name = name.replace(/[\[\]]/g, '\\$&')

    // Создаем регулярное выражение для поиска параметра
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)

    // Выполняем поиск в URL
    const results = regex.exec(url)

    // Если параметр не найден, возвращаем null
    if (!results) return null

    // Если значение параметра отсутствует, возвращаем пустую строку
    if (!results[2]) return ''

    // Декодируем значение параметра и возвращаем его
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
}