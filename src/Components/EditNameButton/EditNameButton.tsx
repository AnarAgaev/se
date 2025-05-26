
import style from './EditNameButton.module.sass'

const { button, small, medium, large } = style

interface Props {
	size: 'small' | 'medium' | 'large'
	cbf: () => void
	title?: string
}

const sizes = {
    small: small,
    medium: medium,
    large: large
}

const EditNameButton = ({ size, cbf, title }: Props) => {
    return (
        <button
            className={`button button_dark ${button} ${sizes[size]}`}
            type="button"
            title={title}
            onClick={cbf}
        >
            <i className="icon icon_edit"></i>
        </button>
    )
}

export default EditNameButton
