import style from './Modal.module.sass'

const {modal, body, close, content, caption, wrap} = style

type TProps = {
    title?: string
    onClose?: () => void
    children: React.ReactNode
}

const Modal = ({title, onClose, children} : TProps) => {
    return (
        <div className={modal}>
            <div className={body}>
                <button type='button' role='close' className={close} onClick={onClose}></button>
                <div className={content}>
                    { title &&
                        <h4 className={caption}>
                            {title}
                        </h4>
                    }
                    <div className={wrap}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal