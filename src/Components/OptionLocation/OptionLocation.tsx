import style from './OptionLocation.module.sass'

type TProps = {
    caption: string
    isChecked: boolean
    eventHandler: () => void
}

const { option, text } = style

const OptionLocation = ({ caption, isChecked, eventHandler }: TProps) => {
    return (
        <li className='closing'>
            <label className={option}>
                <input
                    className='invisible'
                    type='checkbox'
                    checked={isChecked}
                    onChange={eventHandler} />
                <span></span>
                <mark className={text}>{caption}</mark>
            </label>
        </li>
    )
}

export default OptionLocation