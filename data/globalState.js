export const globalState = {
    menu: [
        {
            label: 'Панель управления',
            link: '/',
            icon: 'bi-house-door-fill'
        },
        {
            label: 'Все заказы',
            link: '/orders',
            icon: 'bi-table'
        },
        {
            id: 'bookkeeping',
            label: 'Бухгалтерия',
            link: '/bookkeeping',
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
            icon: 'bi-journal-text',
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
            label: ['orderType'],
            name: 'Тип заказа'
        },
        {
            label: ['manager'],
            name: 'Менеджер'
        },
        {
            label: ['city'],
            name: 'Город'
        },
        {
            label: ['fasadMaterial'],
            name: 'Материал'
        },
        {
            label: ['fasadModel'],
            name: 'Модель'
        },
        {
            label: ['color'],
            name: 'Цвет'
        },
        {
            label: ['totalCost'],
            name: 'Полная стоимость'
        },
        {
            label: ['cost'],
            name: 'Стоимость'
        },
        {
            label: ['pay'],
            name: 'Оплата'
        },
        {
            label: ['debt'],
            name: 'Долг'
        },
        {
            label: ['square'],
            name: 'Площадь'
        },
        {
            label: ['dateSave'],
            name: 'Дата перв. сохр.'
        },
        {
            label: ['dateFirstStage'],
            name: 'Дата начала производства'
        },
        {
            label: ['datePlanPack'],
            name: 'Дата план. упаковки'
        },

        {
            label: ['PLAN_DATE', 'datePlan'],
            name: 'Планируемая дата'
        },
        {
            label: ['DATE_ADDED', 'TRANSFER_DATE', 'date'],
            name: 'Дата'
        },
        {
            label: ['STATUS_NAME', 'STATUS_DESCRIPTION', 'status'],
            name: 'Статус'
        },
        {
            label: ['ORDER_SQUARE', 'ORDER_FASADSQ', 'generalSquare'],
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
            label: ['extraData'],
            name: 'Доп. поля'
        },
        {
            label: ['TRANSFER', 'transfer'],
            name: 'Сдал'
        },
        {
            label: ['ACCEPTED', 'accepted'],
            name: 'Принял'
        },
        {
            label: ['TS'],
            name: 'Дата'
        },
        {
            label: ['MONEY'],
            name: 'Зарплата'
        },
        {
            label: ['workingTime', 'workTime'],
            name: 'Время'
        }
    ]
}