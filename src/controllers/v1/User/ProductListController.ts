import { Request, Response } from "express";
import { Op } from "sequelize";
import { ProductsModel } from "../../../models";

export const getListProducts = async (req: Request, res: Response) => {
  try {
    const pageSize = parseInt((req.query.pageSize as string) || "10");
    const page = parseInt((req.query.page as string) || "1");
    const search = req.query.search || "";
    let category: any = req.query.category || "";
    let brand: any = req.query.brand || "";
    let lastId: any = req.query.lastId || "";
    let sort: any = req.query.sort || "ASC";

    let where: any = {
      status: 1,
    };
    if (lastId) {
      if (sort === "ASC") {
        where.id = {
          [Op.gt]: lastId,
        };
      } else {
        where.id = {
          [Op.lt]: lastId,
        };
      }
    }
    if (category) {
      where.categories = {
        [Op.like]: "%" + category + "%",
      };
    }

    if (brand) {
      where.brand = {
        [Op.like]: "%" + brand + "%",
      };
    }

    if (search) {
      where = {
        ...where,
        [Op.or]: [{ name: { [Op.like]: "%" + search + "%" } }],
      };
    }

    const total = await ProductsModel.count({
      where: where,
    });

    const products = await ProductsModel.findAll({
      where: where,
      limit: pageSize,
      order: [["name", sort]],
      offset: (page - 1) * pageSize,
    });

    res.status(200).send({
      status: true,
      statusCode: 200,
      message: "Fetched",
      error: {},
      extra: {
        totalProducts: total,
        lastId: products[products?.length - 1]?.id || null,
      },
      data: { products },
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
