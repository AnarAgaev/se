import { MouseEvent } from 'react'
import { formatNumber, getPostWordDeclension, collapseDevices } from '../../Helpers'
import { TAppStore, TProject, TConfiguration, TConfigurationList,
    TDeviceList, TBorder } from '../../types'
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

    const borderPrice = !conf.border
        ? 0
        : typeof conf.border.price === 'string'
            ? parseFloat(conf.border.price)
            : conf.border.price

    const devicesPrice: number = !conf.devices
        ? 0
        : conf.devices.reduce((acc, device) => {
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

const getBorder = (border: TBorder, isDevices: boolean): JSX.Element => {
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
                        { isDevices && <button onClick={onShow} /> }
                    </span>
                </div>
            </td>
            <td>1</td>
            <td>{formatNumber(border.price)} р.</td>
        </tr>
    )
}

const getDeviceList = (devices: TDeviceList): JSX.Element[] | null => {

    const deviceList = collapseDevices(devices)

    return deviceList.map(d => {

        const price = typeof d.price === 'string'
            ? parseFloat(d.price)
            : d.price

        const cost = formatNumber(price * d.selectedCount)

        return (
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
                <td>{d.selectedCount}</td>
                <td>{cost} р.</td>
            </tr>
        )
    })
}

const getConfigurationList = (
    configurations: TConfigurationList,
    projectId: string | number,
    roomId: string | number,
    setConfigurationCount: TAppStore['setConfigurationCount'],
    removeConfiguration: TAppStore['removeConfiguration'],
    modalCopyConfigurationSet: TAppStore['modalCopyConfigurationSet'],
    setCurrentConfiguration: TAppStore['setCurrentConfiguration']
): JSX.Element[] | null => {

    const configurationList: JSX.Element[] = []

    configurations.forEach((c, idx) => {

        const vendor = c.border
            ? c.border.vendor
            : c.devices
                ? c.devices[0].vendor
                : ''

        const postsCount = !c.border
            ? 1
            : !c.border.number_of_posts
                ? 1
                : parseInt(c.border.number_of_posts[0])

        const posts = `, ${postsCount} ${postsCount ? getPostWordDeclension(postsCount) : ''}`

        const colorSet = new Set()
        if (c.border) colorSet.add(c.border.color)
        if (c.devices) c.devices.forEach(d => colorSet.add(d.color))
        const color = Array.from(colorSet).join('/')

        const onChangeCount = (direction: -1 | 1) => setConfigurationCount(projectId, roomId, c.id, direction)

        const onRemove = () => removeConfiguration(projectId, roomId, c.id)

        const onReplace = () => {
            setCurrentConfiguration({ projectId, roomId, configurationId: c.id, type: 'replace' })
            modalCopyConfigurationSet('replace', true, 'Перенести комплект')
        }

        const onCopy = () => {
            setCurrentConfiguration({ projectId, roomId, configurationId: c.id, type: 'copy' })
            modalCopyConfigurationSet('copy', true, 'Копировать комплект')
        }

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
                        { c.border && getBorder(c.border, c.devices ? true : false) }
                        { c.devices && getDeviceList(c.devices) }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>
                                <button  onClick={() => {}}
                                    className='button button_small button_dark'
                                    title="Изменить комплект">
                                    <span>Изменить</span>
                                    <i className='icon icon_change'></i>
                                </button>
                                <button onClick={onReplace}
                                    className='button button_small button_dark'
                                    title="Перенести комплект в другой проект/помещение">
                                    <span>Перенести</span>
                                    <i className='icon icon_move'></i>
                                </button>
                                <button onClick={onCopy}
                                    className='button button_small button_dark'
                                    title="Скопировать комплект в другой проект/помещение">
                                    <span>Скопировать</span>
                                    <i className='icon icon_copy'></i>
                                </button>
                                <button onClick={onRemove}
                                    title="Удалить комплект"
                                    className='button button_small button_dark'>
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

const getRoomList = (
    project: TProject,
    setConfigurationCount: TAppStore['setConfigurationCount'],
    removeConfiguration: TAppStore['removeConfiguration'],
    modalCopyConfigurationSet: TAppStore['modalCopyConfigurationSet'],
    setCurrentConfiguration: TAppStore['setCurrentConfiguration']
): JSX.Element[] | null => {

    const roomList: JSX.Element[] = []

    const rooms = project.rooms

    if (!rooms || rooms && rooms.length === 0) return null

    rooms.forEach((r, idx) => {

        const configurations = getConfigurationList(
            r.configurations,
            project.id,
            r.id,
            setConfigurationCount,
            removeConfiguration,
            modalCopyConfigurationSet,
            setCurrentConfiguration
        )

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
        setConfigurationCount,
        removeConfiguration,
        modalCopyConfigurationSet,
        setCurrentConfiguration
    ] = useStore(state => [
        state.setConfigurationCount,
        state.removeConfiguration,
        state.modalCopyConfigurationSet,
        state.setCurrentConfiguration
    ])
    // #endregion

    const roomList = getRoomList(project, setConfigurationCount, removeConfiguration,
            modalCopyConfigurationSet, setCurrentConfiguration)

    if (project && !project.rooms?.length) return (
        <div className={composition}>
            <h3 className={title}>В проект не добавлено ни одного комплекта!</h3>
            <ul className={help}>
                <li>Перейдите на вкладку Конфигуратор;</li>
                <li>Добавьте Рамку и Устройство на холст;</li>
                <li>Выберите Проект и Помещение;</li>
                <li>Кликните Добавить в проект, чтобы добавить комплект.</li>
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