import { Font, Document, Page, View, Text, Image } from '@react-pdf/renderer'
import { TProject } from '../../zod'
import styles from './styles'

const { page, section } = styles

const PdfDocument = ({ project }: { project: TProject }) => {

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


    return (
        <Document language="ru" pageLayout="oneColumn">
            <Page size="A4" style={page}>
                <View style={section}>
                    <Text>{project.name}</Text>
                    <Image source="img/devices/pictures/mechanism_black_switcher_1_sup.png"/>
                </View>
            </Page>
        </Document>
    )
}

export default PdfDocument