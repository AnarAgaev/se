import { useMemo, useId } from 'react'
import { InputSelect, OptionLocation } from '../../Components'
import { TProjectList, TRoomList, TAppStore } from '../../types'
import useStore from '../../Store'
import style from './Locations.module.sass'

const { locations, item, text, location, id } = style

const userToken = window.userToken

const getProjectsOptionsList = (
    key: string,
    projectsList: TProjectList,
    setProject: TAppStore['setProject']
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    projectsList.forEach(project => {
        // Пушим только проекты этого пользователя
        if (project.localProject || (project.token && project.token === userToken)) {
            elementsList.push(
                <OptionLocation
                    key={`${key}-${project.id}`}
                    caption={project.name}
                    isChecked={project.selected}
                    eventHandler={() => setProject(project.id)}
                    locationType='project'
                />
            )
        }
    })

    return elementsList
}

const getRoomsOptionsList = (
    key: string,
    roomsList: TRoomList,
    setRoom: TAppStore['setRoom']
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    roomsList.sort((a, b) => {
        return (a.default === b.default) ? 0 : a.default ? 1 : -1;
    })

    roomsList.forEach(room => {
        elementsList.push(
            <OptionLocation
                key={`${key}-${room.id}`}
                caption={room.name}
                isChecked={room.selected}
                eventHandler={() => setRoom(room.id)}
                editable={room.default}
                locationType='room'
			/>
        )
    })

    return elementsList
}

const Locations = () => {
    const key = useId()

    // #region Variables
    const [
        projects,
        addProject,
        rooms,
        addRoom,
        setProject,
        setRoom,
        editConfiguration
    ] = useStore(state => [
        state.projects,
        state.addProject,
        state.rooms,
        state.addRoom,
        state.setProject,
        state.setRoom,
        state.editConfiguration
    ])
    // #endregion

    const projectsOptions = useMemo(
        () => getProjectsOptionsList(key, projects, setProject),
        [key, projects, setProject]
    )

    const roomsOptions = useMemo(
        () => getRoomsOptionsList(key, rooms, setRoom),
        [key, rooms, setRoom]
    )

    const selectedProject = projects.filter(p => p.selected)[0]
    const selectedRoom = rooms.filter(r => r.selected)[0]

    const [currentProject, currentRoom] = (() => {
        let project: string = ''
        let room: string = ''

        projects.forEach(p => {
            if (p.id === editConfiguration?.projectId && !project) {
                project = p.name

                p.rooms?.forEach(r => {
                    if (r.id === editConfiguration.roomId && !room) {
                        room = r.name
                    }
                })
            }
        })

        return [ project, room ]
    })()

    return (
        <div className={locations}>
            { !editConfiguration
                ? <>
                    <InputSelect
                        type={'project'}
                        cbf={addProject}
                        title={selectedProject ? 'Проект' : 'Выбрать проект'}
                        placeholder="Создать проект"
                        selectedValue={selectedProject && selectedProject.name} >
                        { projectsOptions }
                    </InputSelect>
                    <InputSelect
                        type={'room'}
                        cbf={addRoom}
                        title={selectedRoom ? 'Помещение' : 'Выбрать помещение'}
                        placeholder="Создать помещение"
                        selectedValue={selectedRoom && selectedRoom.name} >
                        { roomsOptions }
                    </InputSelect>
                </>
                : <>
                    <div className={item}>
                        <p className={text}>
                            <span className={location}>{currentProject}</span>
                            <span className={id}>Проект</span>
                        </p>
                    </div>
                    <div className={item}>
                        <p className={text}>
                            <span className={location}>{currentRoom}</span>
                            <span className={id}>Помещение</span>
                        </p>
                    </div>
                </>
            }
        </div>
    )
}

export default Locations
