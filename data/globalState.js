export const globalState = {
    menu: [
        {
            label: 'Панель управления',
            link: '/',
            icon: 'bi-house-door-fill'
        },
        {
            id: 'bookkeeping',
            label: 'Бухгалтерия',
            link: '',
            icon: 'bi-cash-coin',
            submenu: [
                {
                    label: 'Расчет запрлаты',
                    link: '/bookkeeping/period-calculation'
                },
                {
                    label: 'Все транзакции',
                    link: '/bookkeeping/all-transaction'
                }
            ]
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
        },
        {
            id: 'journals',
            label: 'Журналы',
            link: '',
            icon: 'bi-table',
            submenu: []
        }
    ],
    headersTables: [
        {
            label: ['NUMBER'],
            name: '№ п/п'
        },
        {
            label: ['ORDER_NAME', 'ITM_ORDERNUM', 'NAME', 'itmOrderNum'],
            name: 'Наименование'
        },
        {
            label: ['PLAN_DATE', 'datePlan'],
            name: 'Планируемая дата'
        },
        {
            label: ['DATE_ADDED', 'TRANSFER_DATE'],
            name: 'Дата'
        },
        {
            label: ['STATUS_NAME', 'STATUS_DESCRIPTION'],
            name: 'Статус'
        },
        {
            label: ['ORDER_SQUARE', 'ORDER_FASADSQ', 'fasadSquare'],
            name: 'S сборки'
        },
        {
            label: ['nameSectorInOrder'],
            name: 'Участок в заказе'
        },
        {
            label: ['COMMENT_PLAN', 'NOTE', 'comments'],
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
            name: 'Дата'
        },
        {
            label: ['MONEY'],
            name: 'Зарплата'
        }
    ]
}