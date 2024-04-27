import { useRef, useState, ChangeEvent } from 'react'
import style from './BackgroundPicker.module.sass'
import loader from './loader.svg'

const { picker, pickerMessage, pickerButton, pickerErrorMessage, pickerLoading } = style

const BackgroundPicker = () => {

    const [uploadMessage, setUploadMessage] = useState<null | undefined>(null);
    const [selectedFile, setSelectedFile] = useState<null | File>(null)

    const pickerRef = useRef<HTMLInputElement>(null)

    const validTypes = [ 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp' ]

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
            formData.append('file', event.target.files[0])

            const res = await fetch(uploadLink, {
                method: 'POST',
                body: formData
            })

            if (!res.ok) console.error('Failed to upload background image to', uploadLink)

            // const data = await res.json()
            const data = InitDataContractType.parse(await res.json())

            console.log(data);

            // Push data background store list
            // get().setInitBackgroundsData(data.backgrounds)

            // // Ответ от сервера json объект
            // {
            //     fileName: 'имя_загруженного файла'
            //     filePath: 'путь_по_которому_загрузили_файл'
            // }

        } catch (error: Error | unknown) {
            // setUploadMessage(undefined)
        } finally {
            // setSelectedFile(null)
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
                        Загрузить файл
                </button>
            </div>
        </div>
    )
}

export default BackgroundPicker