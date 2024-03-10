import { Request, Response } from "express";
import { CartModel, ProductsModel } from "../../../models";

export const addToCart = async (req: Request, res: Response) => {
  try {
    let { productId, qty, customerId, type } = req?.body;

    qty = qty ? parseFloat(qty) : 0;

    const product: any = await ProductsModel.findOne({
      where: {
        id: productId,
      },
      raw: true,
    });

    if (product?.stock <= 0) {
      return res.status(500).send({
        status: false,
        statusCode: 500,
        message: "Out of stock!!!",
        error: {},
        data: {},
        date: new Date().toISOString(),
      });
    }

    const cartItems = await CartModel.findOne({
      where: {
        customerId: customerId,
        productId: productId,
      },
      raw: true,
    });

    if (cartItems) {
      if (type === "dec") {
        qty = cartItems.quantity - (qty ? qty : product.increment || 1);
      } else {
        qty = cartItems.quantity + (qty ? qty : product.increment || 1);
      }
    } else {
      qty = qty ? qty : product.min_quantity;
    }

    if (cartItems) {
      if (parseFloat(qty) <= 0) {
        await CartModel.destroy({
          where: {
            id: cartItems.id,
          },
        });

        return res.status(200).send({
          status: true,
          statusCode: 200,
          message: "Product Deleted!!!",
          error: {},
          extra: {},
          data: {},
          date: new Date().toISOString(),
        });
      }
      await CartModel.update(
        {
          quantity: parseFloat(qty),
          sale_price: parseFloat(
            product.sale_price
              ? product.sale_price
              : product.mrp
              ? product.mrp
              : 0
          ),
          status: 1,
        },
        {
          where: {
            id: cartItems.id,
          },
        }
      );
    } else {
      await CartModel.create({
        productName: product.name,
        customerId: customerId,
        productId: product.id,
        file: product.cover_file,
        quantity: parseFloat(qty),
        sale_price: parseFloat(
          product.sale_price
            ? product.sale_price
            : product.mrp
            ? product.mrp
            : 0
        ),
        status: 1,
      });
    }

    res.status(200).send({
      status: true,
      statusCode: 200,
      message: "Product Added to Cart",
      error: {},
      extra: {},
      data: {},
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
