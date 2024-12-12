import { TProject } from '../../types'
import style from './ProjectComposition.module.sass'

const { help, composition, item, title, subtitle, rooms, room, table, border, pic, desc, counter, inc, dec } = style

const ProjectComposition = ({ project }: {project: TProject}) => {

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
            <div className={item}>
                <h3 className={title}>Столовая</h3>
                <p className={subtitle}>Комплект Celiane, Лазурный пунктом, 1 пост</p>
                <ul className={rooms}>
                    <li className={room}>
                        <table className={table}>
                            <thead>
                                <tr>
                                    <th>Состав комплектующих НОМЕР 1:</th>
                                    <th>Количество</th>
                                    <th>Стоимость</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className={border}>
                                            <span className={pic}>
                                                <img src="" alt="" />
                                            </span>
                                            <span className={desc}>
                                                <mark>Рамка, цвет Лазурный пунктом, 1 пост</mark>
                                                <i>068771</i>
                                                <button></button>
                                            </span>
                                        </div>
                                    </td>
                                    <td>1</td>
                                    <td>123 078.19 р.</td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className={border}>
                                            <span className={pic}><img src="" alt="" /></span>
                                            <span className={desc}>
                                                <mark>Механизм какой-то</mark>
                                                <i>068771</i>
                                            </span>
                                        </div>
                                    </td>
                                    <td>1</td>
                                    <td>123 078.19 р.</td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className={border}>
                                            <span className={pic}><img src="" alt="" /></span>
                                            <span className={desc}>
                                                <mark>Механизм какой-то</mark>
                                                <i>068771</i>
                                            </span>
                                        </div>
                                    </td>
                                    <td>нет в наличие</td>
                                    <td>123 078.19 р.</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td>
                                        <button className='button button_small button_dark' title="Изменить конфигурацию">
                                            Изменить
                                            <i className='icon icon_change'></i>
                                        </button>
                                        <button className='button button_small button_dark' title="Перенести конфигурацию в другой проект/помещение">
                                            Перенести
                                            <i className='icon icon_moove'></i>
                                        </button>
                                        <button className='button button_small button_dark' title="Скопировать конфигурацию в другой проект/помещение">
                                            Скопировать
                                            <i className='icon icon_copy'></i>
                                        </button>
                                        <button className='button button_small button_dark' title="Удалить конфигурацию">
                                            Удалить
                                            <i className='icon icon_basket'></i>
                                        </button>
                                    </td>
                                    <td>
                                        <div className={counter}>
                                            <button className={dec} />
                                            <input type="text" value="5" readOnly />
                                            <button className={inc} />
                                        </div>
                                    </td>
                                    <td>123 078.19 р.</td>
                                </tr>
                            </tfoot>
                        </table>
                    </li>
                </ul>
            </div>



            <div className={item}>
                <h3 className={title}>Прихожая</h3>
                <p className={subtitle}>Комплект Celiane, Лазурный пунктом, 1 пост</p>
                <ul className={rooms}>
                    <li className={room}>
                        <table className={table}>
                            <thead>
                                <tr>
                                    <th>Состав комплектующих НОМЕР 1:</th>
                                    <th>Количество</th>
                                    <th>Стоимость</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className={border}>
                                            <span className={pic}>
                                                <img src="" alt="" />
                                            </span>
                                            <span className={desc}>
                                                <mark>Рамка, цвет Лазурный пунктом, 1 пост</mark>
                                                <i>068771</i>
                                                <button></button>
                                            </span>
                                        </div>
                                    </td>
                                    <td>1</td>
                                    <td>123 078.19 р.</td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className={border}>
                                            <span className={pic}><img src="" alt="" /></span>
                                            <span className={desc}>
                                                <mark>Механизм какой-то</mark>
                                                <i>068771</i>
                                            </span>
                                        </div>
                                    </td>
                                    <td>1</td>
                                    <td>123 078.19 р.</td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className={border}>
                                            <span className={pic}><img src="" alt="" /></span>
                                            <span className={desc}>
                                                <mark>Механизм какой-то</mark>
                                                <i>068771</i>
                                            </span>
                                        </div>
                                    </td>
                                    <td>нет в наличие</td>
                                    <td>123 078.19 р.</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td>
                                        <button className='button button_small button_dark' title="Изменить конфигурацию">
                                            Изменить
                                            <i className='icon icon_change'></i>
                                        </button>
                                        <button className='button button_small button_dark' title="Перенести конфигурацию в другой проект/помещение">
                                            Перенести
                                            <i className='icon icon_moove'></i>
                                        </button>
                                        <button className='button button_small button_dark' title="Скопировать конфигурацию в другой проект/помещение">
                                            Скопировать
                                            <i className='icon icon_copy'></i>
                                        </button>
                                        <button className='button button_small button_dark' title="Удалить конфигурацию">
                                            Удалить
                                            <i className='icon icon_basket'></i>
                                        </button>
                                    </td>
                                    <td>
                                        <div className={counter}>
                                            <button className={dec} />
                                            <input type="text" value="5" readOnly />
                                            <button className={inc} />
                                        </div>
                                    </td>
                                    <td>123 078.19 р.</td>
                                </tr>
                            </tfoot>
                        </table>
                        <table className={table}>
                            <thead>
                                <tr>
                                    <th>Состав комплектующих НОМЕР 2:</th>
                                    <th>Количество</th>
                                    <th>Стоимость</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className={border}>
                                            <span className={pic}>
                                                <img src="" alt="" />
                                            </span>
                                            <span className={desc}>
                                                <mark>Рамка, цвет Лазурный пунктом, 1 пост</mark>
                                                <i>068771</i>
                                                <button></button>
                                            </span>
                                        </div>
                                    </td>
                                    <td>1</td>
                                    <td>123 078.19 р.</td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className={border}>
                                            <span className={pic}><img src="" alt="" /></span>
                                            <span className={desc}>
                                                <mark>Механизм какой-то</mark>
                                                <i>068771</i>
                                            </span>
                                        </div>
                                    </td>
                                    <td>1</td>
                                    <td>123 078.19 р.</td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className={border}>
                                            <span className={pic}><img src="" alt="" /></span>
                                            <span className={desc}>
                                                <mark>Механизм какой-то</mark>
                                                <i>068771</i>
                                            </span>
                                        </div>
                                    </td>
                                    <td>нет в наличие</td>
                                    <td>123 078.19 р.</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td>
                                        <button className='button button_small button_dark' title="Изменить конфигурацию">
                                            Изменить
                                            <i className='icon icon_change'></i>
                                        </button>
                                        <button className='button button_small button_dark' title="Перенести конфигурацию в другой проект/помещение">
                                            Перенести
                                            <i className='icon icon_moove'></i>
                                        </button>
                                        <button className='button button_small button_dark' title="Скопировать конфигурацию в другой проект/помещение">
                                            Скопировать
                                            <i className='icon icon_copy'></i>
                                        </button>
                                        <button className='button button_small button_dark' title="Удалить конфигурацию">
                                            Удалить
                                            <i className='icon icon_basket'></i>
                                        </button>
                                    </td>
                                    <td>
                                        <div className={counter}>
                                            <button className={dec} />
                                            <input type="text" value="5" readOnly />
                                            <button className={inc} />
                                        </div>
                                    </td>
                                    <td>123 078.19 р.</td>
                                </tr>
                            </tfoot>
                        </table>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default ProjectComposition