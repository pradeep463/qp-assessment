import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "root",
  database: "qp-assessment",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected...");
  })
  .catch((error: any) => {
    console.error("Connection Failed:", error);
  });

const DB: any = {};

DB.Sequelize = Sequelize;
DB.sequelize = sequelize;

DB.products = require("./Tables/Products")(sequelize, DataTypes);
DB.cart = require("./Tables/Cart")(sequelize, DataTypes);
DB.orders = require("./Tables/Orders")(sequelize, DataTypes);
DB.order_details = require("./Tables/OrderDetails")(sequelize, DataTypes);

// DB.sequelize
//   .sync({ force: false })
//   .then(() => {
//     console.log("Synced");
//   })
//   .catch((error: any) => {
//     console.error("Sync failed:", error);
//   });

const ProductsModel = DB.products;
const CartModel = DB.cart;
const OrdersModel = DB.orders;
const orderDetailsModel = DB.order_details;

export { DB, ProductsModel, CartModel, OrdersModel, orderDetailsModel };
