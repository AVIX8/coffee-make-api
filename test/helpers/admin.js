const User = require('../../src/models/User')
//const Role = require('../../src/models/Role')

const superTest = require('supertest')
const app = require('../../app.js')
const agent = superTest.agent(app)

module.exports.promoteToAdmin = async (email) => {
    await User.findOneAndUpdate({ email }, {'$push': {
        'roles': 'admin'
    }})
}

module.exports.getAdminData = async () => {
    let data = {
        email: 'admin3459377766@test.com',
        password: '5484078819',
    }

    let user = await User.findOne({email: data.email})
    // console.log(user);
    if (!user) {
        await agent.post('/api/auth/register').send(data).expect(200)
        await this.promoteToAdmin(data.email)
    }

    user = await User.findOne({email: data.email})
    // console.log(user);
    return data
}
