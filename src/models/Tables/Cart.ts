module.exports = (sequelize: any, DataTypes: any) => {
  const Cart: any = sequelize.define("cart", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    productName: {
      type: DataTypes.STRING(40),
    },
    customerId: {
      type: DataTypes.INTEGER,
    },
    productId: {
      type: DataTypes.INTEGER,
    },
    file: {
      type: DataTypes.TEXT,
    },
    quantity: {
      type: DataTypes.FLOAT,
    },
    discount: {
      type: DataTypes.FLOAT,
    },
    sale_price: {
      type: DataTypes.FLOAT,
    },
    status: {
      type: DataTypes.INTEGER,
    },
  });

  return Cart;
};
