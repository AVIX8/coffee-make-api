const Item = {
    "_id": "054VA72303012P",
    "desc": "Give your dressy look a lift with these women's Kate high-heel shoes by Metaphor. These playful peep-toe pumps feature satin-wrapped stiletto heels and chiffon pompoms at the toes. Rhinestones on each of the silvertone buckles add just a touch of sparkle to these shoes for a flirty footwear look that's made for your next night out.",
    "name": "Women's Kate Ivory Peep-Toe Stiletto Heel",
    "category": "/кофе/моносорта",
    "brand": "Metaphor",
    "imgs": ["http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_967112812","http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_945877912"],
    
    "properties": {
        "кислотность": {
            "maxValue": 5,
            "value": 3
        },
        "плотность": {
            "maxValue": 5,
            "value": 2
        }
    },

    "choiceProperty": {
        "name": "Масса (гр)",
        "variants": [
            {
                "price": 260.00,
                "option": 250
            },
            {
                "price": 940.00,
                "option": 1000
            }
        ]
    }
}

//from clien
const cart = [
    {
        _id: "054VA72303012P",
        quantity: 8,
        option: 250,
    },
    {
        _id: "0151651",
        quantity: 3,
        option: 1000,
    }
]

//from server
const serverCart = {
    hz:"hz"
}

