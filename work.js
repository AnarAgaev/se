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

async function fixDeviceVendor(filePath) {

    const vendorSet = new Set()

    try {
        const data = await fs.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);

        // for (let i = 0; i < 10; i++) {
        //     vendorSet.add(Math.floor(Math.random() * 1000000001))
        // }

        jsonData.devices.forEach(i => {

            i.id = i.id + Math.floor(Math.random() * 1000000001)


            // vendorSet.add(`${i.vendor}-${i.collection}`)

            // if (!i.conf_color) i.conf_color = 'Белый'
            // if (i.collection === 'ATLASDESIGN') {
            //     // i.collection = 'ATLASDESIGN'
            //     filteredDevices.devices.push(i)
            // }
        });

        console.log(Array.from(vendorSet))

        await fs.writeFile(filePath, JSON.stringify(jsonData, null, 4), 'utf8');
        console.log('Сценарий выполнен успешно');
    } catch (error) {
        console.error('Ошибка при обработке JSON файла:', error);
    }
}

const filePath = 'public/mocks/temp.json';
// addColorToBorders(filePath);
fixDeviceVendor(filePath)
