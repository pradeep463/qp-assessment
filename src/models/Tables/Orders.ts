module.exports = (sequelize:any, DataTypes:any) => {
  const Orders = sequelize.define("orders", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    order_number: {
      type: DataTypes.STRING,
    },
    invoice: {
      type: DataTypes.STRING,
    },
    total_items: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isPaid: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    customerId: {
      type: DataTypes.INTEGER,
    },
    address: {
      type: DataTypes.JSON,
    },
    grand_total: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    channel: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    shipping_charge: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    delivery_method: {
      type: DataTypes.STRING,
    },
    payment_method: {
      type: DataTypes.STRING,
    },
    tax_amount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    delivery_partner_id: {
      type: DataTypes.INTEGER,
    },

    transaction_id: {
      type: DataTypes.STRING,
    },
    delivery_date_time: {
      type: DataTypes.DATE,
      defaultValue: null,
    },

    order_status: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  });

  return Orders;
};
