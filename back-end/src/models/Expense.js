const expense = (sequelize, DataTypes) => {
    const Expense = sequelize.define('expense', {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        value: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        }
    })
    return Expense;
}

export default expense