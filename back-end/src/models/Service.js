const service = (sequelize, DataTypes) => {
    const Service = sequelize.define('service', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        }
    });

    Service.associate = models => {
        Service.belongsTo(models.ServiceOrder);
    };

    return Service;
};

export default service