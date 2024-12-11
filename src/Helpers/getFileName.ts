export const getFileName = (name: string, id: string | number): string => {
    const cyrillicToLatinMap: Record<string, string> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': '', 'ы': 'y', 'ь': '',
        'э': 'e', 'ю': 'yu', 'я': 'ya', ' ': '-'
    }

    const number = typeof id === 'number' ? id.toString() : id
    const fileNumber = number.toLowerCase().split('').map(char => cyrillicToLatinMap[char] || char).join('')
    const fileName = name.toLowerCase().split('').map(char => cyrillicToLatinMap[char] || '').join('')

    return `${fileName}__${fileNumber}.pdf`
}