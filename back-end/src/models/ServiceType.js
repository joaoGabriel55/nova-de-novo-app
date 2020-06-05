const serviceType = (sequelize, DataTypes) => {
    const ServiceType = sequelize.define('service_type', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    });

    return ServiceType;
};

export default serviceType