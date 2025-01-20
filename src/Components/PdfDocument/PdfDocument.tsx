import { StyleSheet, Font, BlobProvider, Document,
    Page, View, Text, Image } from '@react-pdf/renderer'

import { Loader } from '../../Components'
import useStore from '../../Store'

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Roboto',
        flexDirection: 'row',
        backgroundColor: 'white'
    },

    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
})

const { page, section } = styles

const PdfDocument = () => {

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

    const ProjectDoc = (
        <Document language="ru" pageLayout="oneColumn">
            <Page size="A4" style={page}>
                <View style={section}>
                    <Text>{project.name}</Text>
                    <Text>{filename}</Text>
                    <Image source="img/devices/pictures/mechanism_black_switcher_1_sup.png"/>
                </View>
            </Page>
        </Document>
    )

    return (
        <BlobProvider document={ProjectDoc}>
            {({ blob, loading, error }) => {

                if (error) {
                    console.log('\x1b[31m%s\x1b[0m', 'Ошибка генерации PDF файла', error.message)
                    resetDownloadProject()
                    return
                }

                if (loading) {
                    return (
                        <Loader text={'Создаем PDF файл'}
                            styles={{
                                position: 'absolute',
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

                    setTimeout(
                        () => setDownloadProjectBlobUrl(blobUrl),
                        300
                    )

                    return
                }
            }}
        </BlobProvider>
    )
}

export default PdfDocument