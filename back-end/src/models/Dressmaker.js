const dressMaker = (sequelize, DataTypes) => {
    const DressMaker = sequelize.define('dressmaker', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: false,
            },
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        contract: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        admission: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        resignation: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            validate: {
                notEmpty: false,
            },
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        }
    });

    return DressMaker;
};

export default dressMaker;