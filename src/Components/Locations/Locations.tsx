import { useMemo, useId } from 'react'
import { InputSelect, OptionLocation } from '../../Components'
import useStore from '../../Store'
import style from './Locations.module.sass'

const { locations } = style

const getProjectsOptionsList = (
    projectsList: string[],
    key: string
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    projectsList.forEach(project => {
        elementsList.push(
            <OptionLocation
                key={`${key}-${project}`}
                caption={project}
                name={'projects'} />
        )
    })

    return elementsList
}

const getRoomsOptionsList = (
    projectsList: string[],
    key: string
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    projectsList.forEach(project => {
        elementsList.push(
            <OptionLocation
                key={`${key}-${project}`}
                caption={project}
                name={'rooms'} />
        )
    })

    return elementsList
}

const Locations = () => {
    const key = useId()
    const projects = useStore(state => state.projects)
    const addProject = useStore(state => state.addProject)
    const rooms = useStore(state => state.rooms)
    const addRoom = useStore(state => state.addRoom)

    const projectsOptions = useMemo(
        () => getProjectsOptionsList(Object.keys(projects), key),
        [projects, key]
    )

    const roomsOptions = useMemo(
        () => getRoomsOptionsList(Object.keys(rooms), key),
        [rooms, key]
    )

    return (
        <div className={locations}>
            <InputSelect
                cbf={addProject}
                title="Выбрать проект"
                placeholder="Создать проект">
                { projectsOptions }
            </InputSelect>
            <InputSelect
                cbf={addRoom}
                title="Выбрать помещение"
                placeholder="Создать помещение">
                { roomsOptions }
            </InputSelect>
        </div>
    )
}

export default Locations