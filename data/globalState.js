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
            label: ['NUMBER'],
            name: '№ п/п'
        },
        {
            label: ['ORDER_NAME', 'ITM_ORDERNUM'],
            name: 'Наименование'
        },
        {
            label: ['PLAN_DATE'],
            name: 'Планируемая дата'
        },
        {
            label: ['STATUS_NAME', 'STATUS_DESCRIPTION'],
            name: 'Статус'
        },
        {
            label: ['ORDER_SQUARE', 'ORDER_FASADSQ'],
            name: 'S сборки'
        },
        {
            label: ['COMMENT_PLAN', 'NOTE'],
            name: 'Комментарий'
        },
        {
            label: ['TRANSFER'],
            name: 'Передающий участок'
        },
        {
            label: ['ACCEPTED'],
            name: 'Принимающий участок'
        },
        {
            label: ['TS'],
            name: 'TS'
        }
    ]
}