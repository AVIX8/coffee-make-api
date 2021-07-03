const User = require('../../src/models/User')
//const Role = require('../../src/models/Role')
const jwt = require('jsonwebtoken')

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
        password: '5484078819'
    }
    if (!this.accessToken) {
        await agent.post('/api/auth/register').send(data).expect(200)
        await this.promoteToAdmin(data.email)
    
        this.accessToken = jwt.sign(
            { ...data, roles: ['user', 'admin']},
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' }
        )
    }
    return { data, accessToken: this.accessToken }
}
