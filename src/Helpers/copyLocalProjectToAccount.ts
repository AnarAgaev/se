import { defaultFetchHeaders } from '../Helpers'
import { TProjectList, TAppStore, TProject } from '../types'

type TFuncCopyList = (
    projectsLocal: TProjectList,
    userToken: string,
    modalMessageSet: TAppStore['modalMessageSet']
) => Promise<TProjectList>

type TFuncCopyItem = (
    project: TProject,
    userToken: string,
    apiLink: string,
    modalMessageSet: TAppStore['modalMessageSet']
) => Promise<TProject>

const copySingleProject: TFuncCopyItem = async (
    project,
    userToken,
    apiLink,
    modalMessageSet
) => {
    const headers: HeadersInit = { ...defaultFetchHeaders, Token: userToken }
    const body = { domain: 'fandeco', project_id: project.id }

    try {
        const res = await fetch(apiLink, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        })

        if (!res.ok) {
            const errData = await res.json()
            const errObj = JSON.parse(errData.errors.error[0])
            console.log('\x1b[31m%s\x1b[0m', 'Error Object:')
            console.error(errObj)

            modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`Ошибка запроса Копировать локальные проект в аккаунт! Запрос к URL ${apiLink}. Ошибка на проекте с ИД ${project.id}`)
        }

        const data: Pick<TProject, 'id'> = await res.json()

        console.log('Скопировали локальный проект в аккаунт. Получили результат:', data)

        const copiedProject = {
            ...project,
            id: data.id,
            token: userToken
        }

        delete copiedProject['localProject']

        return copiedProject

    } catch (error) {
        console.error('Ошибка при копировании проекта:', error)

        modalMessageSet(true, 'Ошибка запроса!')

        throw error // Пробрасываем ошибку дальше
    }
}

export const copyLocalProjectToAccount: TFuncCopyList = async (
    projectsLocal,
    userToken,
    modalMessageSet
) => {
    const apiLink = window.copyProjectLink

    if (!apiLink) {
        modalMessageSet(true, 'Ошибка запроса!')
        throw new Error('На странице не указана ссылка на API Copy Project window.copyProjectLink')
    }

    try {
        const promises = projectsLocal.map(project =>
            copySingleProject(project, userToken, apiLink, modalMessageSet)
        )

        const results = await Promise.all(promises)

        return results
    } catch (error) {
        console.error('Ошибка при копировании локальных проектов:', error)

        modalMessageSet(true, 'Ошибка запроса!')

        return []
    }
}