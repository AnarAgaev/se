import { useRef, useState, ChangeEvent } from 'react'
import { BackgroundType } from '../../Store/zod-data-contracts'
import { generateErrorMessage, ErrorMessageOptions } from 'zod-error'
import useStore from '../../Store'
import style from './BackgroundPicker.module.sass'
import loader from './loader.svg'

const zodErrorOptions: ErrorMessageOptions = {
    delimiter: {
        error: '\n',
    },
    path: {
        enabled: true,
        type: 'zodPathArray',
        label: 'Zod Path: ',
    },
    code: {
        enabled: true,
    },
    message: {
        enabled: true,
        label: '',
    },
    transform: ({ errorMessage, index }) => `🔥 \x1b[31m Zod Error #${index + 1}: \x1b[33m ${errorMessage}`,
}

const { picker, pickerMessage, pickerButton, pickerErrorMessage, pickerLoading } = style

const BackgroundPicker = () => {
    const addUploadedBackground = useStore(state => state.addUploadedBackground)

    const [uploadMessage, setUploadMessage] = useState<null | undefined>(null);
    const [selectedFile, setSelectedFile] = useState<null | File>(null)

    const pickerRef = useRef<HTMLInputElement>(null)

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

    const handlePickerInputChange = async (event: ChangeEvent<HTMLInputElement>) => {

        if (!event.target.files) return

        const file = event.target.files[0]

        // Checking file type
        if (validTypes.findIndex(type => type === file.type) === -1) {
            setUploadMessage(undefined)
            return
        } else {
            setUploadMessage(null)
        }

        setSelectedFile(file)

        try {
            const uploadLink = window.uploadBackgroundLink

            if (!uploadLink) console.error(
                'There is no link window.uploadBackgroundLink on the page to upload backgrounds.')

            const formData = new FormData()
            formData.append('image', event.target.files[0])
            formData.append('dir', 'backgrounds')

            const res = await fetch(uploadLink, {
                method: 'POST',
                body: formData
            })

            if (!res.ok) console.error('Failed to upload background image to', uploadLink)

            const safeResponse = BackgroundType
                .passthrough().safeParse(await res.json())
            console.log('Uploading image response', safeResponse)

            if (!safeResponse.success) {
                const errorMessage = generateErrorMessage(safeResponse.error.issues, zodErrorOptions)
                console.log(errorMessage)

                return
            }

            // Push data background store list
            addUploadedBackground(safeResponse.data)

        } catch (error: Error | unknown) {
            console.error(error);
            setUploadMessage(undefined)
        } finally {
            setSelectedFile(null)
        }
    }

    const uploadingMessage = (() => {
        if (uploadMessage === undefined)
            return <span className={pickerErrorMessage}>
                Ошибка загрузки файла
            </span>

        if (uploadMessage === null && selectedFile === null)
            return 'Загрузите свой фон'

        if (uploadMessage === null && selectedFile)
            return <span className={pickerLoading}>
                <b>Загружаем файл:</b>
                <mark>{selectedFile.name.split('.')[0] + '.'}</mark>
                <span>{selectedFile.name.split('.')[1]}</span>
                <img src={loader} alt="" />
            </span>
    })()

    const clazz = (() =>
        uploadMessage === null && selectedFile
            ? 'button button_block button_lite disabled'
            : 'button button_block button_lite')()

    return (
        <div className={picker}>
            <input className="invisible" type="file" ref={pickerRef} onChange={handlePickerInputChange}
                capture="user" accept="image/*, image/jpeg, image/jpg, image/png, image/gif, image/webp" />

            <span className={pickerMessage}>
                { uploadingMessage }
            </span>

            <div className={pickerButton}>
                <button type='button' className={clazz}
                    onClick={() => pickerRef.current && pickerRef.current.click()}>
                        Выбрать файл
                </button>
            </div>
        </div>
    )
}

export default BackgroundPicker