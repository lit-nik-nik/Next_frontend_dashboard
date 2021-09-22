export const globalState = {
    menu: [
        {
            label: 'Панель управления',
            link: '/',
            icon: 'bi-house-door-fill'
        },
        {
            label: 'Прием-передача заказа',
            link: '/at-order',
            icon: 'bi-grid'
        },
        {
            label: 'Добавить заказ',
            link: '/order/create',
            icon: 'bi-plus-circle-fill'
        }
    ],
    headersTables: [
        {
            label: 'NUMBER',
            name: '№ п/п'
        },
        {
            label: 'ORDER_NAME',
            name: 'Наименование'
        },
        {
            label: 'PLAN_DATE',
            name: 'Планируемая дата'
        },
        {
            label: 'STATUS_NAME',
            name: 'Статус'
        },
        {
            label: 'ORDER_SQUARE',
            name: 'S сборки'
        },
        {
            label: 'COMMENT_PLAN',
            name: 'Комментарий'
        }
    ]
}