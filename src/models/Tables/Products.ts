module.exports = (sequelize: any, DataTypes: any) => {
  const Products: any = sequelize.define("products", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(40),
    },
    categories: {
      type: DataTypes.TEXT,
    },
    brand: {
      type: DataTypes.TEXT,
    },
    hsn: {
      type: DataTypes.STRING(30),
    },
    barcode: {
      type: DataTypes.STRING(40),
    },
    tax: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.TEXT("long"),
    },
    cover_file: {
      type: DataTypes.STRING(100),
    },
    unit: {
      type: DataTypes.STRING(10),
    },
    sku: {
      type: DataTypes.STRING(30),
    },
    increment: {
      type: DataTypes.FLOAT,
    },
    weight: {
      type: DataTypes.FLOAT,
    },
    min_quantity: {
      type: DataTypes.FLOAT,
    },
    max_quantity: {
      type: DataTypes.FLOAT,
    },
    files: {
      type: DataTypes.JSON,
    },
    discount: {
      type: DataTypes.FLOAT,
    },
    purchase_price: {
      type: DataTypes.FLOAT,
    },
    mrp: {
      type: DataTypes.FLOAT,
    },
    sale_price: {
      type: DataTypes.FLOAT,
    },
    expired: {
      type: DataTypes.DATE,
    },
    stock: {
      type: DataTypes.FLOAT,
    },
    status: {
      type: DataTypes.INTEGER,
    },
  });

  return Products;
};
