const menu = [
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
]

export const addMenu = (journals) => {
    let submenu = []
    let newMenu = [...menu]

    journals.map(item => {
        let submenuItem = {
            label: item.name,
            link: `/journal/${item.id}/plans`
        }

        submenu.push(submenuItem)
    })

    newMenu.map(item => {
        if (item.id === 'journals') {
            item.submenu = submenu
        }
    })

    return newMenu
}