import style from './Modal.module.sass'

const {modal, body, close, content, header, caption, subcaption, wrap, show} = style

type TProps = {
    title?: string
    subtitle?: string
    visible: boolean
    onClose?: () => void
    children?: React.ReactNode
}

const Modal = ({title, subtitle, onClose, children, visible} : TProps) => {
    return (
        <div className={visible ? `${modal} ${show}` : modal}>
            <div className={body}>
                <button type='button' role='close' className={close} onClick={onClose}></button>
                <div className={content}>
                    <div className={header}>
                        {title && <h4 className={caption}>{title}</h4>}
                        {subtitle && <p className={subcaption}>{subtitle}</p>}
                    </div>
                    <div className={wrap}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal