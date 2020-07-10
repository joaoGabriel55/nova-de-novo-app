import models, { sequelize } from '../models';

export async function findCustomerById(id) {
    try {
        const customerFound = await models.Customer.findOne({ where: { id: id, active: true } })
        if (!customerFound)
            return null
        return customerFound
    } catch (error) {
        throw error
    }
}