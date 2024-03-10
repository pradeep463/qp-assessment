// models/orderDetails.js

module.exports = (sequelize: any, DataTypes: any) => {
  const OrderDetails = sequelize.define("order_details", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    order_number: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    file: {
      type: DataTypes.STRING,
    },
    tax: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    unit: {
      type: DataTypes.STRING,
    },
    quantity: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    unit_price: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    sub_total: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    productId: {
      type: DataTypes.BIGINT,
    },
    status: {
      type: DataTypes.INTEGER,
    },
  });

  return OrderDetails;
};
