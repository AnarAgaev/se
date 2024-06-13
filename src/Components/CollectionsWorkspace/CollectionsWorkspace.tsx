import style from './CollectionsWorkspace.module.sass'

const { collections, page, col, col_one, col_two,
    content, desc, pic, empty, billboard } = style

const CollectionsWorkspace = () => {
    return (
        <section className={collections}>
            <article className={page}>
                <div className={`${col} ${col_one}`}>
                    <div className={empty}>
                        <img src="https://aws.massive.ru/sew/img/collections/selogo.png" alt="" />
                    </div>
                </div>
                <div className={`${col} ${col_two}`}>
                    <div className={empty}>
                        <p>
                            Systeme Electric — российская компания с мировой экспертизой. Мы разрабатываем, производим и поставляем оборудование для распределения электроэнергии и промышленной автоматизации.
                            <br />
                            Мы даем возможность максимально эффективно использовать энергию и ресурсы благодаря нашей экосистеме продуктов, сервисов и цифровых решений на базе российских разработок и ПО.
                            <br />
                            Наши ключевые приоритеты — фокус на партнерах и заказчиках и превосходное качество продукции.
                        </p>
                    </div>
                </div>
                <div className={`${col} ${col_one}`}>
                    <div className={content}>
                        <div className={desc}>
                            <h3>Энергия</h3>
                            <p>Systeme Electric — эксперт в распределении электроэнергии и автоматизации в режиме реального времени. Мы делаем процессы и энергосистемы безопасными, эффективными и технологичными.</p>
                        </div>
                        <div className={pic}>
                            <img src="https://aws.massive.ru/sew/img/collections/se-p1.jpg" alt="" />
                        </div>
                    </div>
                </div>
                <div className={`${col} ${col_one}`}>
                    <div className={content}>
                        <div className={desc}>
                            <h3>Технологии</h3>
                            <p>Технические и цифровые решения Systeme Electric помогают нашим клиентам и партнерам внедрять инновации и улучшать бизнес-процессы. Мы предлагаем продукцию и комплексные решения для энергетики, промышленной автоматизации, IT-инфраструктуры и зданий.</p>
                        </div>
                        <div className={pic}>
                            <img src="https://aws.massive.ru/sew/img/collections/se-p2.jpg" alt="" />
                        </div>
                    </div>
                </div>
                <div className={`${col} ${col_one}`}>
                    <div className={content}>
                        <div className={desc}>
                            <h3>Надежность</h3>
                            <p>Наши продукты соответствуют международным и российским стандартам качества, а комплексная сервисная поддержка помогает поддерживать оборудование в исправном состоянии и продлевать срок его службы.</p>
                        </div>
                        <div className={pic}>
                            <img src="https://aws.massive.ru/sew/img/collections/se-p3.jpg" alt="" />
                        </div>
                    </div>
                </div>
                <div className={`${col} ${col_one}`}>
                    <div className={content}>
                        <div className={desc}>
                            <p>Мы локализовали производство и разработки, благодаря чему сохранили уникальный портфель продукции и предлагаем комплексные решения, не имеющие аналогов на российском рынке.</p>
                        </div>
                    </div>
                </div>
                <div className={`${col} ${col_two}`}>
                    <div className={billboard}>
                        <img src="https://aws.massive.ru/sew/img/collections/se-p4.jpg" alt="" />
                    </div>
                </div>
            </article>
        </section>
    )
}

export default CollectionsWorkspace