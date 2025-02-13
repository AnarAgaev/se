
// https://fandeco.ru/configuratorse?share=8a71ea49-dfc2-4475-8364-a8576c987a5c


import { useRef, useState } from 'react'
import { Modal } from '../../Components'
import useStore from '../../Store'
import style from './ModalLoadProject.module.sass'

const { controllers, error } = style

const removeProtocol = (url: string) => {
    return url.replace(/^https?:\/\//, '');
}

const checkInputText = (link: string): boolean => {

    return link !== ''

    // if (link === '') return false

    // const _VALID_DOMAIN = 'fandeco.ru'

    // try {
    //     const urlObj = new URL('https://' + removeProtocol(link))
    //     return urlObj.hostname === _VALID_DOMAIN
    // } catch (error) {
    //     return false
    // }
}

const getParamFromUrl = (link: string, param: string) => {
    const url = new URL("http://" + link)
    return url.searchParams.get(param)
}

const ModalLoadProject = ({visible}: {visible: boolean}) => {

    const inputRef = useRef<HTMLInputElement | null>(null)
    const [isError, setError] = useState(false)

    // #region Variables
    const [
        value,
        setValue,
        modalLoadProjectSet,
        loadProject
    ] = useStore(state => [
        state.modalLoadProjectValue,
        state.modalLoadProjectSetValue,
        state.modalLoadProjectSet,
        state.loadProject
    ])
    // #endregion

    const onClose = () => {
        modalLoadProjectSet(false, '')
        setError(false)
    }

    const onInput = () => {
        const controller = inputRef.current
        setValue(controller ? controller.value : '')
    }

    const onSend = () => {
        const controller = inputRef.current

        if (!controller) return

        if (!checkInputText(controller.value)) {
            setError(true)
            return
        }

        const projectToken = getParamFromUrl(removeProtocol(controller.value), 'share')

        if (!projectToken) {
            setError(true)
            return
        }

        setError(false)
        modalLoadProjectSet(false, '')
        loadProject(controller.value)
    }

    return (
        <Modal visible={visible} title='Загрузить проект по ссылке' onClose={onClose}>
            <div className={controllers}>
                <input
                    ref={inputRef}
                    value={value}
                    onChange={onInput}
                    type='text'
                    placeholder='Вставьте ссылку на проект'
                />
                <button type='button' className='button button_dark' onClick={onSend}>
                    Примерить
                    <i className='icon  icon_check'></i>
                </button>
            </div>
            { isError && <p className={error}>Укажите корректную ссылку</p> }
        </Modal>
    )
}

export default ModalLoadProject
