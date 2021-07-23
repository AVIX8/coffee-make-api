module.exports = {
    item: {
        _id: '054VA72303012P',
        title: 'Mild',
        descr: 'Смесь арабики с ароматом сладкой карамели, какао и бисквитной выпечки (сладкий).',
        imgs: ['hz1', 'hz2'],
        slug: 'mild',
        characteristics: [
            // участвуют в фильтации
            {
                title: 'Обжарка',
                value: 'Средняя',
            },
            {
                title: 'Кислотность',
                value: 'Средняя',
            },
            {
                title: 'Сорт',
                value: '100% арабика',
            },
            {
                title: 'Купаж',
                value: 'Смесь',
            },
            {
                title: 'География',
                value: 'Бразилия, Колумбия, Гватемала.',
            },
        ],
        attributes: [
            // не участвуют в фильтрации
            {
                title: 'Масса (гр)',
                value: 1000,
            },
        ],

        // с вариациями
        variants: [
            {
                SKU: '5474',
                price: 1200,
                attributes: [
                    {
                        title: 'Масса (гр)',
                        value: 1000,
                    },
                ],
                isStock: true,
            },
            {
                SKU: '5475',
                price: 300,
                attributes: {
                    title: 'Масса (гр)',
                    value: 250,
                },
                isStock: true,
            },
        ],
        // без вариаций
        // variants: [
        //   {
        //     price: 1200,
        //     SKU: '5474',
        //     isStock: true,
        //   },
        // ],
    },

    // ORDER
    // from client
    fullName: 'dogdan andreevich',
    phone: '8-(913) 437 21 45',
    address: 'глазурная 224',
    cart: [
        {
            SKU: '5454',
            quantity: 8,
        },
        {
            SKU: '5471',
            quantity: 8,
        },
        {
            SKU: '5472',
            quantity: 3,
        },
    ],
}
