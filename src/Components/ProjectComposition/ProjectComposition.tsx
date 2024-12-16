import { MouseEvent } from 'react'
import { formatNumber, getPostWordDeclension } from '../../Helpers'
import { TAppStore, TProject, TConfiguration, TConfigurationList, TDeviceList, TBorder } from '../../types'
import useStore from '../../Store'
import style from './ProjectComposition.module.sass'

const { help, composition, room, title, subtitle, sets, set,
    table, item, pic, desc, counter, disabled, inc, dec, dropped } = style

type TOnShow = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void

const onShow: TOnShow = (e) => {
    const button: HTMLButtonElement = e.target as HTMLButtonElement
    const table: HTMLElement | null = button.closest('table')
    if (table) table.classList.toggle(dropped)
}

const getTotalPriceConfiguration = (conf: TConfiguration): string => {
    const count = conf.count

    const borderPrice = typeof conf.border.price === 'string'
        ? parseFloat(conf.border.price)
        : conf.border.price

    const devicesPrice: number = conf.devices.reduce((acc, device) => {
        if (typeof device.price === 'string') {
            return acc + parseFloat(device.price)
        } else if (typeof device.price === 'number') {
            return acc + device.price
        } else {
            return acc
        }
    }, 0)

    return formatNumber((borderPrice + devicesPrice) * count)
}

const getBorder = (border: TBorder): JSX.Element => {
    return (
        <tr key={border.show_article}>
            <td>
                <div className={item}>
                    <span className={pic}>
                        <img src={border.preview} alt={border.name} />
                    </span>
                    <span className={desc}>
                        <mark>{border.name}</mark>
                        <i>{border.show_article}</i>
                        <button onClick={onShow} />
                    </span>
                </div>
            </td>
            <td>1</td>
            <td>{formatNumber(border.price)} р.</td>
        </tr>
    )
}

const getDeviceList = (devices: TDeviceList): JSX.Element[] | null => {

    if (!devices.length) return null

    const deviceList: JSX.Element[] = []

    devices.forEach(d => {
        deviceList.push(
            <tr key={d.show_article}>
                <td>
                    <div className={item}>
                        <span className={pic}>
                            <img src={d.preview} alt={d.name} />
                        </span>
                        <span className={desc}>
                            <mark>{d.name}</mark>
                            <i>{d.show_article}</i>
                        </span>
                    </div>
                </td>
                <td>1</td>
                <td>{formatNumber(d.price)} р.</td>
            </tr>
        )
    })

    return deviceList
}

const getConfigurationList = (
    configurations: TConfigurationList,
    projectId: string | number,
    roomId: string | number,
    setConfigurationCount: TAppStore['setConfigurationCount']
): JSX.Element[] | null => {

    const configurationList: JSX.Element[] = []

    configurations.forEach((c, idx) => {

        const vendor = c.border.vendor

        const postsCount = !c.border.number_of_posts
            ? null
            : parseInt(c.border.number_of_posts[0])

        const posts = `, ${postsCount} ${postsCount ? getPostWordDeclension(postsCount) : ''}`

        const colorSet = new Set()
        colorSet.add(c.border.color)
        c.devices.forEach(d => colorSet.add(d.color))
        const color = Array.from(colorSet).join('/')

        const onChangeCount = (direction: -1 | 1) => setConfigurationCount(projectId, roomId, c.id, direction)

        configurationList.push(
            <li className={set} key={`${c.id}-${idx}`}>
                <p className={subtitle}>{`Комплект ${vendor}, ${color}${posts}`}</p>
                <table className={table}>
                    <thead>
                        <tr>
                            <th>Состав комплектующих</th>
                            <th>Количество</th>
                            <th>Стоимость</th>
                        </tr>
                    </thead>
                    <tbody>
                        { getBorder(c.border) }
                        { getDeviceList(c.devices) }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>
                                <button className='button button_small button_dark' title="Изменить конфигурацию">
                                    <span>Изменить</span>
                                    <i className='icon icon_change'></i>
                                </button>
                                <button className='button button_small button_dark' title="Перенести конфигурацию в другой проект/помещение">
                                    <span>Перенести</span>
                                    <i className='icon icon_move'></i>
                                </button>
                                <button className='button button_small button_dark' title="Скопировать конфигурацию в другой проект/помещение">
                                    <span>Скопировать</span>
                                    <i className='icon icon_copy'></i>
                                </button>
                                <button className='button button_small button_dark' title="Удалить конфигурацию">
                                    <span>Удалить</span>
                                    <i className='icon icon_basket'></i>
                                </button>
                            </td>
                            <td>
                                <div className={counter}>
                                    <button className={c.count === 1 ? `${dec} ${disabled}` : dec} onClick={() => onChangeCount(-1)}/>
                                    <input type="text" value={c.count} readOnly />
                                    <button className={inc} onClick={() => onChangeCount(1)}/>
                                </div>
                            </td>
                            <td>{getTotalPriceConfiguration(c)} р.</td>
                        </tr>
                    </tfoot>
                </table>
            </li>
        )
    })

    return configurationList
}

const getRoomList = (project: TProject, setConfigurationCount: TAppStore['setConfigurationCount']): JSX.Element[] | null => {

    const roomList: JSX.Element[] = []

    const rooms = project.rooms

    if (!rooms || rooms && rooms.length === 0) return null

    rooms.forEach((r, idx) => {

        const configurations = getConfigurationList(r.configurations, project.id, r.id, setConfigurationCount)

        roomList.push(
            <div key={`${r.id}-${idx}`} className={room}>
                <h3 className={title}>{r.name}</h3>
                <ul className={sets}>
                    { configurations }
                </ul>
            </div>
        )
    })

    return roomList
}

const ProjectComposition = ({ project }: { project: TProject }) => {

    // #region Variables
    const [
        setConfigurationCount
    ] = useStore(state => [
        state.setConfigurationCount
    ])
    // #endregion

    const roomList = getRoomList(project, setConfigurationCount)
    // const roomList = useMemo(() => getRoomList(project, setConfigurationCount), [project, setConfigurationCount])

    if (project && !project.rooms?.length) return (
        <div className={composition}>
            <h3 className={title}>В проекте нет конфигураций!</h3>
            <ul className={help}>
                <li>Перейдите на вкладку Конфигуратор;</li>
                <li>Выберите Рамку и Устройство;</li>
                <li>Выберите Проект и Помещение;</li>
                <li>Кликните Добавить в проект, чтобы добавить конфигурацию.</li>
            </ul>
        </div>
    )

    return (
        <div className={composition}>
            { roomList }
        </div>
    )
}

export default ProjectComposition