import { useMemo, useId } from 'react'
import { InputSelect, OptionLocation } from '../../Components'
import { TProjectList, TRoomList, TAppStore } from '../../types'
import useStore from '../../Store'
import style from './Locations.module.sass'

const { locations } = style

const getProjectsOptionsList = (
    key: string,
    projectsList: TProjectList,
    setProject: TAppStore['setProject']
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    projectsList.forEach(project => {
        elementsList.push(
            <OptionLocation
                key={`${key}-${project.id}`}
                caption={project.name}
                isChecked={project.selected}
                eventHandler={() => setProject(project.id)} />
        )
    })

    return elementsList
}

const getRoomsOptionsList = (
    key: string,
    roomsList: TRoomList,
    setRoom: TAppStore['setRoom']
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    roomsList.forEach(room => {
        elementsList.push(
            <OptionLocation
                key={`${key}-${room.id}`}
                caption={room.name}
                isChecked={room.selected}
                eventHandler={() => setRoom(room.id)} />
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
        setRoom
    ] = useStore(state => [
        state.projects,
        state.addProject,
        state.rooms,
        state.addRoom,
        state.setProject,
        state.setRoom
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

    const selectedProject = projects.filter(p => p.selected)[0];
    const selectedRoom = rooms.filter(r => r.selected)[0]

    return (
        <div className={locations}>
            <InputSelect
                cbf={addProject}
                title="Выбрать проект"
                placeholder="Создать проект"
                selectedValue={selectedProject && selectedProject.name} >
                { projectsOptions }
            </InputSelect>
            <InputSelect
                cbf={addRoom}
                title="Выбрать помещение"
                placeholder="Создать помещение"
                selectedValue={selectedRoom && selectedRoom.name} >
                { roomsOptions }
            </InputSelect>
        </div>
    )
}

export default Locations