import { Request, Response } from "express";
import {
  CartModel,
  orderDetailsModel,
  OrdersModel,
  ProductsModel,
} from "../../../models";

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { customerId, deliveryMethod, channel, shipping_charge, address } =
      req?.body;

    const cartData = await CartModel.findAll({
      where: { customerId },
      raw: true,
    });

    const orderCount = await OrdersModel.count({});

    const orderNumber = "order" + "_" + orderCount + 1001;
    const invoiceNumber = "INV" + "_" + orderCount + 1001;
    let orderStatus = "Received";
    let grand_total = 0;
    let discount = 0;
    let taxAmount = 0;
    let delivery_date_time = 0;

    let orderDetails: any = [];

    const order: any = {
      order_number: orderNumber,
      invoice: invoiceNumber,
      total_items: cartData.length,
      isPaid: 0,
      customerId: customerId,
      address: address,
      grand_total: grand_total,
      discount: discount,
      channel: channel,
      shipping_charge: shipping_charge,
      delivery_method: deliveryMethod,
      payment_method: "COD",
      tax_amount: taxAmount,
      transaction_id: null,
      delivery_date_time: delivery_date_time,
      order_status: orderStatus,
      status: 1,
    };

    const orderData = await OrdersModel.create(order);

    for (let index = 0; index < cartData.length; index++) {
      const element = cartData[index];

      const product = await ProductsModel.findOne({
        where: {
          id: element.productId,
        },
      });

      grand_total = grand_total + element.sale_price * element.quantity;

      const disc = product.mrp - element.sale_price;
      discount = discount + (disc > 0 ? disc * element.quantity : 0);

      const unitTax =
        ((element.sale_price * element.quantity) / (1 + product.tax / 100)) *
        (product.tax / 100);

      taxAmount = taxAmount + unitTax;

      orderDetails.push({
        order_id: orderData.id,
        order_number: orderNumber,
        name: element.productName,
        file: element.file,
        tax: unitTax,
        unit: product.unit,
        quantity: element.quantity,
        unit_price: element.sale_price,
        discount: disc > 0 ? disc : 0,
        sub_total: element.sale_price * element.quantity,
        productId: element?.productId,
        status: 1,
      });
    }

    await OrdersModel.update(
      {
        grand_total: grand_total ? grand_total : 0,
        discount: discount ? discount : 0,
        tax_amount: taxAmount ? taxAmount : 0,
      },
      {
        where: { id: orderData.id },
      }
    );

    await orderDetailsModel.bulkCreate(orderDetails);

    res.status(200).send({
      status: true,
      statusCode: 200,
      message: "Order Placed",
      error: {},
      extra: {},
      data: { orderDetails, order },
      date: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(500).send({
      status: false,
      statusCode: 500,
      message: "Something went wrong!!!",
      error: {
        error: error.toString(),
      },
      data: {},
      date: new Date().toISOString(),
    });
  }
};
