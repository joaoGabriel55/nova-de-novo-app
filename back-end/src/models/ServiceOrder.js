const serviceOrder = (sequelize, DataTypes) => {
    const ServiceOrder = sequelize.define('service_order', {
        deliveryDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        entryDate: {
            type: DataTypes.DATE,
            allowNull: true,
            validate: {
                notEmpty: false,
            },
        },
        deliveryPeriod: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        totalPrice: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        status: {
            type: DataTypes.STRING, // FINISHED or PENDING
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        customerId: {
            type: DataTypes.INTEGER,
            references: { model: 'customers', key: 'id' }
        },
        dressmakerId: {
            type: DataTypes.INTEGER,
            references: { model: 'dressmakers', key: 'id' }
        }
    })

    ServiceOrder.associate = models => {
        ServiceOrder.hasOne(models.Customer, {
            foreignKey: "customerId",
            as: "customer",
        })
    }

    ServiceOrder.associate = models => {
        ServiceOrder.hasOne(models.Dressmaker, {
            foreignKey: "dressmakerId",
            as: "dressmaker",
        })
    }

    ServiceOrder.associate = models => {
        ServiceOrder.hasMany(models.Service, { onDelete: 'CASCADE' })
    }

    ServiceOrder.createServiceOrder = async (customerId, dressmakerId, serviceOrder) => {
        try {
            const result = await ServiceOrder.create({
                deliveryDate: serviceOrder.deliveryDate,
                entryDate: serviceOrder.entryDate,
                deliveryPeriod: serviceOrder.deliveryPeriod,
                totalPrice: serviceOrder.totalPrice,
                status: serviceOrder.status,
                customerId: customerId,
                dressmakerId: dressmakerId,
            })
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    return ServiceOrder;
};

export default serviceOrder