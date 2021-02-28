import models from '../models';

export async function findDressmakerById(id) {
    try {
        const dressmakerFound = await models.Dressmaker.findOne({ where: { id: id, active: true } })
        if (!dressmakerFound)
            return null
        return dressmakerFound
    } catch (error) {
        throw error
    }
}