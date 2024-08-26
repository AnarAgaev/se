import { useMemo, useId } from 'react'
import { InputSelect, OptionLocation } from '../../Components'
import { ProjectListType } from '../../Store/zod-data-contracts'
import { z } from 'zod'
import useStore from '../../Store'
import style from './Locations.module.sass'

const { locations } = style

const getProjectsOptionsList = (
    projectsList: z.infer<typeof ProjectListType>,
    key: string
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    projectsList.forEach(project => {
        elementsList.push(
            <OptionLocation
                key={`${key}-${project.id}`}
                caption={project.name}
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
        () => getProjectsOptionsList(projects, key),
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