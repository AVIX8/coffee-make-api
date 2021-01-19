import Category from '../models/Category.js'

export async function get(req, res) {
    
    let { parentPath, parentId } = req.body
    
    if (parentId) {
        let parent = await Category.findById(parentId)
        if (!parent)
            return res.status(400).send({ message: 'invalid category id' })
        parentPath = parent.category
    }
    let categories = await Category.find({ parent: new RegExp('^' + parentPath) })
    return res.send({ categories })
}

export async function create(req, res) {
    let { name, parentId } = req.body
    if (!name) return res.status(400).send({ message: 'name is required' })
    let parentPath = ''
    if (parentId) {
        let parent = await Category.findById(parentId)
        if (!parent)
            return res.status(400).send({ message: 'invalid category id' })
        parentPath = parent.category
    }
    let category = parentPath + '/' + name
    let cat = new Category({ name, parent: parentPath, category })
    cat.save()
        .then((item) => {
            res.send(item)
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send({ message: 'failed to create category', err })
        })
}

export function update(req, res) {
    console.log(req.body)
    res.send('update')
}
