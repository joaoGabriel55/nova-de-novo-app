const serviceOrder = (sequelize, DataTypes) => {
    const ServiceOrder = sequelize.define('service_order', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
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

    return ServiceOrder;
};

export default serviceOrder