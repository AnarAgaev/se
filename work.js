import fs from 'fs/promises';

async function addColorToBorders(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);

        if (jsonData.devices) {
            jsonData.devices.forEach(i => {
                if (!i.color) {
                    i.color = "Белый";
                }
            });
        }

        await fs.writeFile(filePath, JSON.stringify(jsonData, null, 4), 'utf8');
        console.log('Сценарий выполнен успешно');
    } catch (error) {
        console.error('Ошибка при обработке JSON файла:', error);
    }
}

const filePath = 'public/mocks/fix.json';
addColorToBorders(filePath);
