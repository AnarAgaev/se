import { StyleSheet, Font, BlobProvider, Document, Page, View, Text, Image } from '@react-pdf/renderer'
import { getTotalProjectCost, getPostWordDeclension, formatNumber,
    collapseDevices, getTotalPriceConfiguration, getCurrentDatetime  } from '../../Helpers'
import { Loader } from '../../Components'
import useStore from '../../Store'

import { TProject, TConfigurationList, TBorder, TDevice } from '../../types'

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Roboto',
        backgroundColor: 'white',
        flexDirection: 'column',
        fontSize: '8pt',
        padding: '1cm 1.5cm 2cm 1.5cm'
    },

    logoWrap: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
        height: 'auto',
        marginBottom: '20pt'
    },

    logo: {
        width: '75pt',
        height: 'auto'
    },

    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15pt',
    },

    room: {
        display: 'flex',
        flexDirection: 'column',
    },

    projectName: {
        fontSize: '14pt',
        marginBottom: '20pt'
    },

    roomName: {
        fontSize: '10pt',
        fontWeight: 600,
        marginBottom: '2pt'
    },

    sets: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10pt',
        width: '100%',
    },

    set: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10pt',
        position: 'relative',
        width: '100%'
    },

    roomTitle: {
        fontSize: '8pt',
        fontWeight: 400,
        marginTop: '3pt'
    },

    table: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2pt',
        width: '100%'
    },

    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: '3pt',
        width: '100%'
    },

    column: {
        flexShrink: 0,
    },

    column_1: {
        width: '65%',
    },

    column_2: {
        width: '15%',
        textAlign: 'center'
    },

    column_3: {
        width: '20%',
        textAlign: 'right',
    },

    content: {
        padding: '5pt'
    },

    caption: {
        paddingTop: '5pt',
        paddingBottom: '5pt',
        backgroundColor: '#f7f7f7',
        fontWeight: 600,
    },

    item: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '10pt',
        width: '100%',
        minHeight: '30pt',
    },

    image: {
        flexShrink: 0,
        width: '30pt',
        height: 'auto',
    },

    desc: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '3pt',
        width: '100%'
    },

    descText: {
        width: '100%'
    },

    descArticle: {
        color: '#999'
    },

    total: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 'auto',
        fontSize: '15pt',
        marginTop: '15pt',
        fontWeight: 'bold'
    },

    bold: {
        fontWeight: 'bold'
    },

    line: {
        width: '100%',
        height: '0.3pt',
        backgroundColor: '#b7b7b7',
        marginTop: '50pt'
    },

    pageData: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100%',
        height: 'auto',
        padding: '0 1cm 1cm 1.5cm',
        fontSize: '6pt'
    },

    date: {
        display: 'flex',
        alignItems: 'flex-start',
    },

    pageNumber: {
        display: 'flex',
        justifyContent: 'flex-end',
    }
})

const getBorder = (border: TBorder | undefined): JSX.Element | null => {

    if (!border) return null

    return (
        <View style={styles.row}>
            <View style={{...styles.column, ...styles.column_1}}>
                <View style={{...styles.item, ...styles.content}}>
                    <Image style={styles.image} src={border.preview} />
                    <View style={styles.desc}>
                        <Text style={styles.descText}>{border.name}</Text>
                        <Text style={styles.descArticle}>{border.show_article}</Text>
                    </View>
                </View>
            </View>
            <View style={{...styles.column, ...styles.column_2}}>
                <Text style={styles.content}>1</Text>
            </View>
            <View style={{...styles.column, ...styles.column_3}}>
                <Text style={styles.content}>{formatNumber(border.price)} р.</Text>
            </View>
        </View>
    )
}

const getDeviceList = (devices: (TDevice | null)[]): JSX.Element[] | null => {

    const deviceList = collapseDevices(devices)

    return deviceList.map(device => {

        const price = typeof device.price === 'string'
            ? parseFloat(device.price)
            : device.price

        return (
            <View style={styles.row}>
                <View style={{...styles.column, ...styles.column_1}}>
                    <View style={{...styles.item, ...styles.content}}>
                        <Image style={styles.image} src={device.preview} />
                        <View style={styles.desc}>
                            <Text style={styles.descText}>{device.name}</Text>
                            <Text style={styles.descArticle}>{device.show_article}</Text>
                        </View>
                    </View>
                </View>
                <View style={{...styles.column, ...styles.column_2}}>
                    <Text style={styles.content}>{device.selectedCount}</Text>
                </View>
                <View style={{...styles.column, ...styles.column_3}}>
                    <Text style={styles.content}>
                        {formatNumber(price * device.selectedCount)} р.
                    </Text>
                </View>
            </View>
        )
    })
}

const getConfigurationList = ( configurations: TConfigurationList ): JSX.Element[] => {

    const configurationList: JSX.Element[] = []

    configurations.forEach(c => {

        // #region Set title text
        const vendor = c.border
            ? c.border.vendor
            : c.devices
                ? c.devices[0] !== null
                    ? c.devices[0].vendor
                    : ''
                : ''

        const postsCount = !c.border
            ? 1
            : !c.border.number_of_posts
                ? 1
                : parseInt(c.border.number_of_posts[0])

        const posts = `${postsCount} ${postsCount ? getPostWordDeclension(postsCount) : ''}`

        const colorSet = new Set()
        if (c.border) colorSet.add(c.border.color)
        if (c.devices) c.devices.forEach(d => d && colorSet.add(d.color))
        const color = Array.from(colorSet).join('/')
        // #endregion

        const border = getBorder(c.border)

        configurationList.push(
            <View style={styles.set}>
                <Text style={styles.roomTitle}>
                    <Text style={styles.bold}>
                        Комплект:
                    </Text> {vendor}, {color}, {posts}
                </Text>
                <View style={styles.table}>
                    <View style={styles.row}>
                        <View style={{...styles.column, ...styles.column_1}}>
                            <Text style={{...styles.caption, ...styles.content}}>Состав комплектующих</Text>
                        </View>
                        <View style={{...styles.column, ...styles.column_2}}>
                            <Text style={styles.caption}>Количество</Text>
                        </View>
                        <View style={{...styles.column, ...styles.column_3}}>
                            <Text style={{...styles.caption, ...styles.content}}>Стоимость</Text>
                        </View>
                    </View>
                    { border }
                    { getDeviceList(c.devices as (TDevice | null)[]) }
                    <View style={styles.row}>
                        <View style={{...styles.column, ...styles.column_1}}>
                            <Text style={{...styles.content, ...styles.bold}}>Итого за комплект/комплекты</Text>
                        </View>
                        <View style={{...styles.column, ...styles.column_2}}>
                            <Text style={styles.content}>{c.count}</Text>
                        </View>
                        <View style={{...styles.column, ...styles.column_3}}>
                            <Text style={styles.content}>{getTotalPriceConfiguration(c)} р.</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    })

    return configurationList
}

const getRoomList = (
    project: TProject,
): JSX.Element[] => {

    const roomList: JSX.Element[] = []

    const rooms = project.rooms

    if (!rooms || rooms && rooms.length === 0) return []

    rooms.forEach(r => {
        const configurations = getConfigurationList(r.configurations)

        roomList.push(
            <View style={styles.room} >
                <Text style={styles.roomName}>{r.name}</Text>
                <View style={styles.sets}>
                    { configurations }
                </View>
            </View>
        )
    })

    return roomList
}

const PdfDocument = () => {

    // #region Variables
    const [
        resetDownloadProject,
        setDownloadProjectBlobUrl,
        project,
        filename,
    ] = useStore(state => [
        state.resetDownloadProject,
        state.setDownloadProjectBlobUrl,
        state.downloadProjectAsPdf,
        state.downloadProjectFilename,
    ])
    // #endregion

    if (!project || !filename) return null

    Font.register({
        family: 'Roboto',
        fonts: [
            {
                src: 'fonts/Roboto/Roboto-Regular.ttf',
                // font-style: normal,
                // font-weight: normal
            },
            {
                src: 'fonts/Roboto/Roboto-Medium.ttf',
                fontWeight: 'medium'
            },
            {
                src: 'fonts/Roboto/Roboto-Bold.ttf',
                fontWeight: 'bold'
            },
        ]
    })

    const totalProjectCost = formatNumber(getTotalProjectCost(project))
    const roomList = getRoomList(project)

    const ProjectDoc = (
        <Document language="ru" pageLayout="singlePage">
            <Page size="A4" style={styles.page}>
                <View style={styles.logoWrap}>
                    <Image style={styles.logo} src="https://aws.massive.ru/se-configurator/logo.png" />
                </View>
                <View style={styles.section}>
                    <Text style={styles.projectName}>
                        <Text style={styles.bold}>Проект: </Text>
                        <Text>{project.name}</Text>
                    </Text>
                </View>
                <View style={styles.section}>
                    { roomList }
                </View>
                <View style={styles.line}></View>
                <View style={styles.section}>
                    <View style={styles.total}>
                        <Text>Итого стоимость проекта:</Text>
                        <Text>{ totalProjectCost } р.</Text>
                    </View>
                </View>
                <View style={styles.pageData} fixed>
                    <Text style={styles.date}>{`Сгенерировано: ${getCurrentDatetime()}`}</Text>
                    <Text render={({ pageNumber, totalPages }) => (
                        `Страница ${pageNumber} из ${totalPages}`
                    )} />
                </View>
            </Page>
        </Document>
    )

    return (
        <BlobProvider document={ProjectDoc}>
            {({ blob, loading, error }) => {

                if (error) {
                    console.log('\x1b[31m%s\x1b[0m', 'Ошибка генерации PDF файла:', error.message)
                    resetDownloadProject()
                    return
                }

                if (loading) {
                    return (
                        <Loader text={'Создаем PDF файл'}
                            styles={{
                                position: 'fixed',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '240px'
                            }}
                        />
                    )
                }

                if (blob) {
                    const blobUrl = URL.createObjectURL(blob)
                    setTimeout(() => setDownloadProjectBlobUrl(blobUrl), 300)
                    return
                }
            }}
        </BlobProvider>
    )
}

export default PdfDocument