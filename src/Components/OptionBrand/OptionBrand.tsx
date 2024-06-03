import style from './OptionBrand.module.sass'

const { option, picture, text} = style

const OptionBrand = (props: {img: string, caption: string}) => {
    return (
        <li>
            <div className={option}>
                <span className={picture}>
                    <img src={props.img} alt={props.caption} />
                </span>
                <mark className={text}>{props.caption}</mark>
            </div>
        </li>
    )
}

export default OptionBrand