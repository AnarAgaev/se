import style from './OptionCollection.module.sass'

const { option, text} = style

const OptionCollection = (props: {caption: string}) => {
    return (
        <li>
            <div className={option}>
                <mark className={text}>{props.caption}</mark>
            </div>
        </li>
    )
}

export default OptionCollection