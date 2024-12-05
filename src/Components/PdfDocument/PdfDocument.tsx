import { Page, Text, View, Document, Font } from '@react-pdf/renderer'
import { TProject } from '../../zod'
import styles from './styles'

const { page, section } = styles

const PdfDocument = ({ project }: { project: TProject }) => {

    Font.register({
        family: 'Roboto',
        src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
    })


    return (
        <Document>
            <Page size="A4" style={page}>
                <View style={section}>
                    <Text>{project.name}</Text>
                </View>
            </Page>
        </Document>
    )
}

export default PdfDocument