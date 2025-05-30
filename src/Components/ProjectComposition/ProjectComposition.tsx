import { formatNumber, getPostWordDeclension, collapseDevices,
	getTotalPriceConfiguration, getRoomStatusById } from '../../Helpers'
import { TAppStore, TProject, TConfigurationList, TDeviceList, TBorder,
    TNumberOfPosts, TGetCountOfPosts, TSetSingleFilter, TSetEditSketch,
    TDevice, TBackgroundsStore, TRoomList} from '../../types'
import { PriceChangeTooltip, NotAvailableTooltip, EditNameButton } from '../../Components'
import useStore from '../../Store'
import style from './ProjectComposition.module.sass'

const userToken = window.userToken

const { help, composition, room, title, subtitle, sets, set,
    table, item, pic, desc, counter, disabled, inc, dec,
    dropped, withoutBorder, prices } = style

const getBorder = (border: TBorder): JSX.Element => {

    const price = typeof border.price === 'string'
        ? parseFloat(border.price)
        : border.price

    const startPrice = border.start_price ??
        typeof border.start_price === 'string'
            ? parseFloat(border.start_price as 'string')
            : border.start_price

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
                    </span>
                </div>
            </td>
            <td>
                { border.active && border.available
                    ? 1
                    : <NotAvailableTooltip />
                }
            </td>
            <td>
                <div className={prices}>
                    <span>{formatNumber(price)} р.</span>
                    {
                        startPrice && startPrice !== price &&
                        <PriceChangeTooltip price={formatNumber(startPrice)} />
                    }
                </div>
            </td>
        </tr>
    )
}

const getDeviceList = (devices: (TDevice | null)[]): JSX.Element[] | null => {

    const deviceList = collapseDevices(devices)

    return deviceList.map(d => {

        const price = typeof d.price === 'string'
            ? parseFloat(d.price)
            : d.price

        const startPrice = d.start_price ??
            typeof d.start_price === 'string'
                ? parseFloat(d.start_price as 'string')
                : d.start_price

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
                <td>
                    { d.active && d.available
                        ? d.selectedCount
                        : <NotAvailableTooltip />
                    }
                </td>
                <td>
                    <div className={prices}>
                        <span>{formatNumber(price * d.selectedCount)} р.</span>
                        {
                            startPrice && startPrice !== price &&
                            <PriceChangeTooltip price={formatNumber(startPrice * d.selectedCount)} />
                        }
                    </div>
                </td>
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
    setCurrentConfiguration: TAppStore['setCurrentConfiguration'],
    setEditConfiguration: TAppStore['setEditConfiguration'],
    getCountOfPosts: TGetCountOfPosts,
    setSingleBordersFilter: TSetSingleFilter,
    setSingleDevicesFilter: TSetSingleFilter,
    setEditSketch: TSetEditSketch,
    setEditBackground: TBackgroundsStore['setEditBackground'],
    localProject: TProject['localProject'],
    projectToken: TProject['token'],
    roomIdx: number
): JSX.Element[] | null => {

    const configurationList: JSX.Element[] = []

    configurations.forEach((c, idx) => {

        // #region Set title text
        const vendor = c.border
            ? c.border.vendor
            : c.devices
                ? c.devices[0] !== null
                    ? c.devices[0].vendor
                    : ''
                : ''

        const postsCount = !c.border
            ? 1
            : !c.border.number_of_posts
                ? 1
                : parseInt(c.border.number_of_posts[0])

        const posts = `, ${postsCount} ${postsCount ? getPostWordDeclension(postsCount) : ''}`

        const colorSet = new Set()
        if (c.border) colorSet.add(c.border.color)
        if (c.devices) c.devices.forEach(d => d && colorSet.add(d.color))
        const color = Array.from(colorSet).join('/')
        // #endregion

        const onChangeCount = (direction: -1 | 1) => setConfigurationCount(projectId, roomId, c.id, { direction })

        const onChangeCountField = (e: React.ChangeEvent<HTMLInputElement>) => {

            let value = Math.abs(
                parseInt(
                    e.target.value.replace(/\D/g, '')
                )
            )

            if (!value) value = 0

            setConfigurationCount(projectId, roomId, c.id, { value })
        }

        const onBlurContField = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.value === '') {
                setConfigurationCount(projectId, roomId, c.id, { value: 1 })
            }
        }

        const onRemove = () => removeConfiguration(projectId, roomId, c.id)

        const onReplace = () => {
            setCurrentConfiguration({ projectId, roomId, configurationId: c.id, type: 'replace' })
            modalCopyConfigurationSet('replace', true, 'Перенести комплект')
        }

        const onCopy = () => {
            setCurrentConfiguration({ projectId, roomId, configurationId: c.id, type: 'copy' })
            modalCopyConfigurationSet('copy', true, 'Копировать комплект')
        }

        const onEdit = () => {
            setEditConfiguration(projectId, roomId, c.id)

            let border: TBorder | null = null
            let numberOfPosts: TNumberOfPosts | null = null
            let countOfPosts: number | null = null
            let devices: (TDevice | null)[] | null = null

            if (c.border) {
                border = c.border
                countOfPosts = getCountOfPosts(c.border)

                const posts: string[] | undefined = c.border.number_of_posts
                numberOfPosts = !posts ? 1 : parseInt(posts[0]) as TNumberOfPosts
            }

            if (c.devices) {
                devices = c.devices as (TDevice | null)[] | null
            }

            setEditSketch(border, numberOfPosts, countOfPosts, devices, c.direction)

            // Выставляем селекты Бренда и Коллекции
            if (border || devices) {
                const collection = border
                    ? border.collection
                    // devices не может быть пустым после проверки border
                    // Иначе комплект не добавился бы в проект.
                    // Для добавления комплекта в Проекта обязательно должно
                    // быть выбрано что-то одно, либо рамка, либо устройство
                    : (devices as TDeviceList)[0].collection

                const brand = border
                    ? border.vendor
                    : (devices as TDeviceList)[0].vendor


                setSingleBordersFilter('collection', collection)
                setSingleBordersFilter('brand', brand)

                setSingleDevicesFilter('collection', collection)
                setSingleDevicesFilter('brand', brand)
            }

            // Выставляем выбранный пользователем фон для редактируемого комплекта
            setEditBackground(c.background)
        }

        const canEditProject = localProject || (userToken !== undefined && userToken === projectToken)

        const isSomeDevicesAvailable = c.devices && c.devices.some(d => d?.active && d.available)

        const isBorderOrSomeDevicesAvailable = (c.border?.active && c.border?.available) || isSomeDevicesAvailable

        configurationList.push(
            <li className={set} key={`${c.id}-${idx}`}>
                <p className={subtitle}>{`Комплект ${vendor}, ${color}${posts}`}</p>
                <table className={`${table} ${dropped}`}>
                    <thead>
                        <tr>
                            <th>Состав комплектующих</th>
                            <th>Количество</th>
                            <th>Стоимость</th>
                        </tr>
                    </thead>
                    <tbody>
                        { c.border && getBorder(c.border) }
                        { c.devices && getDeviceList(c.devices as (TDevice | null)[]) }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>
                                <div id={roomIdx === 0 && idx === 0 ? 'step_22' : undefined}>
                                    { canEditProject &&
                                        <button onClick={onEdit}
                                            className={`button button_small button_dark ${isBorderOrSomeDevicesAvailable ? '' : 'disabled'}`}
                                            title="Изменить комплект">
                                            <span>Изменить</span>
                                            <i className='icon icon_change'></i>
                                        </button>
                                    }
                                    { canEditProject &&
                                        <button onClick={onReplace}
                                            className={`button button_small button_dark ${isBorderOrSomeDevicesAvailable ? '' : 'disabled'}`}
                                            title="Перенести комплект в другой проект/помещение">
                                            <span>Перенести</span>
                                            <i className='icon icon_move'></i>
                                        </button>
                                    }
                                    <button onClick={onCopy}
                                        className={`button button_small button_dark ${!canEditProject ? 'single' : ''} ${isBorderOrSomeDevicesAvailable ? '' : 'disabled'}`}
                                        title="Скопировать комплект в другой проект/помещение">
                                        <span>Скопировать</span>
                                        <i className='icon icon_copy'></i>
                                    </button>
                                    { canEditProject &&
                                        <button onClick={onRemove}
                                            title="Удалить комплект"
                                            className='button button_small button_dark'>
                                            <span>Удалить</span>
                                            <i className='icon icon_basket'></i>
                                        </button>
                                    }
                                </div>
                            </td>
                            <td>
                                <div id={roomIdx === 0 && idx === 0 ? 'step_23' : undefined} className={counter}>
                                    { canEditProject && <button className={(c.count === 1 || c.count === 0) ? `${dec} ${disabled}` : dec} onClick={() => onChangeCount(-1)}/> }

                                    <input
                                        type="text"
                                        className={!canEditProject ? withoutBorder : ''}
                                        value={c.count === 0 ? '' : c.count}
                                        onChange={onChangeCountField}
                                        onBlur={onBlurContField}
                                    />

                                    { canEditProject && <button className={c.count === 0 ? `${inc} ${disabled}` : inc} onClick={() => onChangeCount(1)}/> }
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
    setCurrentConfiguration: TAppStore['setCurrentConfiguration'],
    setEditConfiguration: TAppStore['setEditConfiguration'],
    getCountOfPosts: TGetCountOfPosts,
    setSingleBordersFilter: TSetSingleFilter,
    setSingleDevicesFilter: TSetSingleFilter,
    setEditSketch: TSetEditSketch,
    setEditBackground: TBackgroundsStore['setEditBackground'],
    modalRenameProjectRoomSet: TAppStore['modalRenameProjectRoomSet'],
	appRooms: TRoomList
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
            setCurrentConfiguration,
            setEditConfiguration,
            getCountOfPosts,
            setSingleBordersFilter,
            setSingleDevicesFilter,
            setEditSketch,
            setEditBackground,
            project.localProject,
            project.token,
            idx
        )

		const roomStatus = getRoomStatusById({ rooms: appRooms, roomId: r.id })

        roomList.push(
            <div key={`${r.id}-${idx}`} className={room}>
                <h3 className={title}>
                    <span id={idx === 0 ? 'step_18' : undefined}>{r.name}</span>
					{ !roomStatus && // Show not only default status rooms as room status isn't true
						<EditNameButton
							cbf={() => modalRenameProjectRoomSet(
								'room',
								true,
								r.name,
								project.id,
								r.id
							)}
							size='medium'
							title='Переименовать помещение' />
					}
                </h3>
                <ul id={idx === 0 && idx === 0 ? 'step_21' : undefined} className={sets}>
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
        setCurrentConfiguration,
        setEditConfiguration,
        getCountOfPosts,
        setSingleBordersFilter,
        setSingleDevicesFilter,
        setEditSketch,
        setEditBackground,
        modalRenameProjectRoomSet,
		appRooms
    ] = useStore(state => [
        state.setConfigurationCount,
        state.removeConfiguration,
        state.modalCopyConfigurationSet,
        state.setCurrentConfiguration,
        state.setEditConfiguration,
        state.getCountOfPosts,
        state.setSingleBordersFilter,
        state.setSingleDevicesFilter,
        state.setEditSketch,
        state.setEditBackground,
        state.modalRenameProjectRoomSet,
		state.rooms
    ])
    // #endregion

    const roomList = getRoomList(project, setConfigurationCount, removeConfiguration,
            modalCopyConfigurationSet, setCurrentConfiguration, setEditConfiguration,
            getCountOfPosts, setSingleBordersFilter, setSingleDevicesFilter,
            setEditSketch, setEditBackground, modalRenameProjectRoomSet, appRooms)

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
