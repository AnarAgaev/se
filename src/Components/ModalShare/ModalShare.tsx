import { useRef, useState, useEffect } from 'react'
import { Modal } from '../../Components'
import useStore from '../../Store'
import style from './ModalShare.module.sass'

const { label, input, progress, path } = style

const ModalShare = ({visible}: {visible: boolean}) => {

    const inputRef = useRef<HTMLInputElement | null>(null)
    const buttonRef = useRef<HTMLButtonElement | null>(null)

    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const tid = setTimeout(() => setCopied(false), 5000)
        return () => clearTimeout(tid)
    }, [copied, setCopied])

    // #region Variables
    const [
        value,
        modalShareSet
    ] = useStore(state => [
        state.modalShareValue,
        state.modalShareSet
    ])
    // #endregion

    const copyToClipboard = () => {
        if (!inputRef.current || !buttonRef.current) return

        inputRef.current.select()
        document.execCommand('copy')
        setCopied(true)
        buttonRef.current.focus()
    }

    return (
        <Modal visible={visible} title='Поделиться проектом' onClose={() => modalShareSet(false, null)}>
            <label className={label}>
                <input ref={inputRef}
                    className={input}
                    type="text"
                    readOnly autoComplete="off"
                    value={value ? value : ''}
                />
            </label>
            <button ref={buttonRef} onClick={copyToClipboard}
                style={{ pointerEvents: copied ? 'none' : 'all' }}
                className='button button_block button_dark'>
                { copied ? 'Ссылка скопирована' : 'Скопировать ссылку' }
                { copied &&
                    <svg width="16" height="16" viewBox="0 0 16 16" className={progress}>
                        <circle className={path}></circle>
                    </svg>
                }
            </button>
        </Modal>
    )
}

export default ModalShare
