import { Request, Response } from "express";
import { ProductsModel } from "../../../../models";
import { FILE_BASE_URL } from "../../../../configs/ENV";
import { Op } from "sequelize";
export const addProducts = async (req: Request, res: Response) => {
  try {
    const {
      name,
      categories,
      brand,
      hsn,
      barcode,
      tax,
      description,
      unit,
      sku,
      increment,
      weight,
      min_quantity,
      max_quantity,
      discount,
      purchase_price,
      mrp,
      expired,
      sale_price,
      stock,
    } = req.body;

    if (name && categories) {
      const isExist = await ProductsModel.count({
        where: {
          name: name,
        },
      });

      if (isExist) {
        return res.status(409).send({
          status: false,
          statusCode: 409,
          message: "Product Already Exist!!!",
          error: {},
          data: {},
          date: new Date().toISOString(),
        });
      }

      const files: any = req.files;

      const coverFileExist: any = files?.filter(
        (i: any) => i.fieldname === "cover_file"
      );
      const allFileExist: any = files?.filter(
        (i: any) => i.fieldname === "files"
      );
      let cover_file = "";

      if (coverFileExist?.length > 0) {
        cover_file = FILE_BASE_URL + coverFileExist[0]?.path;
      }

      const allFiles: any = [];

      for (let index = 0; index < allFileExist?.length; index++) {
        const element = allFileExist[index];
        allFiles.push(FILE_BASE_URL + element?.path);
      }

      await ProductsModel.create({
        name: name ? name : null,
        categories: categories ? categories : null,
        brand: brand ? brand : null,
        hsn: hsn ? hsn : null,
        barcode: barcode ? barcode : null,
        tax: tax ? parseInt(tax) : null,
        description: description ? description : null,
        unit: unit ? unit : null,
        cover_file: cover_file ? cover_file : null,
        files: allFiles,
        sku: sku ? sku : null,
        increment: increment ? parseFloat(increment) : 1,
        weight: weight ? parseFloat(weight) : 0,
        min_quantity: min_quantity ? parseFloat(min_quantity) : 1,
        max_quantity: max_quantity ? parseFloat(max_quantity) : 5,
        discount: discount ? parseFloat(discount) : 0,
        purchase_price: purchase_price ? parseFloat(purchase_price) : 0,
        mrp: mrp ? parseFloat(mrp) : 0,
        sale_price: sale_price ? parseFloat(sale_price) : 0,
        expired: expired ? expired : null,
        stock: stock ? parseFloat(stock) : 0,
        status: 1,
      });

      res.status(200).send({
        status: true,
        statusCode: 200,
        message: "Product added successfully",
        error: {},
        data: {},
        date: new Date().toISOString(),
      });
    } else {
      return res.status(400).send({
        status: false,
        statusCode: 400,
        message: "Invalid Request!!!",
        error: {},
        data: {},
        date: new Date().toISOString(),
      });
    }
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

export const updateProducts = async (req: Request, res: Response) => {
  try {
    const {
      name,
      categories,
      brand,
      hsn,
      barcode,
      tax,
      description,
      unit,
      sku,
      increment,
      weight,
      min_quantity,
      expired,
      max_quantity,
      discount,
      purchase_price,
      mrp,
      sale_price,
      stock,
      id,
    } = req.body;

    if (name && categories && id) {
      const files: any = req.files;

      const coverFileExist: any = files?.filter(
        (i: any) => i.fieldname === "cover_file"
      );
      const allFileExist: any = files?.filter(
        (i: any) => i.fieldname === "files"
      );
      let cover_file = "";

      if (coverFileExist?.length > 0) {
        cover_file = FILE_BASE_URL + coverFileExist[0]?.path;
      }

      const allFiles: any = [];

      for (let index = 0; index < allFileExist?.length; index++) {
        const element = allFileExist[index];
        allFiles.push(FILE_BASE_URL + element?.path);
      }

      await ProductsModel.update(
        {
          name: name ? name : null,
          categories: categories ? categories : null,
          brand: brand ? brand : null,
          hsn: hsn ? hsn : null,
          barcode: barcode ? barcode : null,
          tax: tax ? parseInt(tax) : null,
          description: description ? description : null,
          unit: unit ? unit : null,
          sku: sku ? sku : null,
          increment: increment ? parseFloat(increment) : 1,
          weight: weight ? parseFloat(weight) : 0,
          min_quantity: min_quantity ? parseFloat(min_quantity) : 1,
          max_quantity: max_quantity ? parseFloat(max_quantity) : 5,
          discount: discount ? parseFloat(discount) : 0,
          purchase_price: purchase_price ? parseFloat(purchase_price) : 0,
          mrp: mrp ? parseFloat(mrp) : 0,
          sale_price: sale_price ? parseFloat(sale_price) : 0,
          expired: expired ? new Date(expired) : null,
          stock: stock ? parseFloat(stock) : 0,
          status: 1,
        },
        {
          where: {
            id: id,
          },
        }
      );

      const product: any = await ProductsModel.findOne({
        where: {
          id: id,
        },
      });

      if (cover_file) {
        await ProductsModel.update(
          {
            cover_file: cover_file,
          },
          {
            where: {
              id: id,
            },
          }
        );
      }

      if (allFiles.length > 0) {
        for (let index = 0; index < product?.files.length; index++) {
          const element = product?.files[index];
          allFiles.push(element);
        }
        await ProductsModel.update(
          {
            files: allFiles,
          },
          {
            where: {
              id: id,
            },
          }
        );
      }

      res.status(200).send({
        status: true,
        statusCode: 200,
        message: "Product Updated successfully",
        error: {},
        data: { product },
        date: new Date().toISOString(),
      });
    } else {
      return res.status(400).send({
        status: false,
        statusCode: 400,
        message: "Invalid Request!!!",
        error: {},
        data: {},
        date: new Date().toISOString(),
      });
    }
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

export const getProducts = async (req: Request, res: Response) => {
  try {
    const pageSize = parseInt((req.query.pageSize as string) || "10");
    const page = parseInt((req.query.page as string) || "1");
    const search = parseInt((req.query.search as string) || "1");

    let where: any = {
      status: 1,
    };

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
      offset: (page - 1) * pageSize,
    });

    res.status(200).send({
      status: true,
      statusCode: 200,
      message: "Fetched",
      error: {},
      extra: {
        totalPage: total,
        currentPage: page,
        perPage: pageSize,
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

export const manageInventory = async (req: Request, res: Response) => {
  try {
    const { stock, expired, id, discount, purchase_price, mrp, sale_price } =
      req.body;
    if (stock && expired && id) {
      await ProductsModel.update(
        {
          stock : stock ? stock : 0,
          expired : expired ? expired : null,
          discount : discount ? discount : 0,
          purchase_price : purchase_price ? purchase_price : 0,
          mrp : mrp ? mrp : 0,
          sale_price : sale_price ? sale_price : 0,
        },
        {
          where: {
            id,
          },
        }
      );

      res.status(200).send({
        status: true,
        statusCode: 200,
        message: "Fetched",
        error: {},
        extra: {},
        data: {},
        date: new Date().toISOString(),
      });
    } else {
      throw new Error("Missing fields");
    }
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

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deleteType = (req.query.delete as string) || "SOFT";
    const id = req.query.id;

    if (deleteType === "SOFT") {
      await ProductsModel.update(
        {
          status: 2,
        },
        {
          where: {
            id,
          },
        }
      );
    } else {
      await ProductsModel.destroy({
        where: {
          id,
        },
      });
    }

    res.status(200).send({
      status: true,
      statusCode: 200,
      message: "Product Deleted successfully",
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
