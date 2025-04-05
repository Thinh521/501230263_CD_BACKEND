import { removeVietnameseAccents } from "../common/index.js";
import CategoryModel from "../models/cateroryModel.js";
import ProductModel from "../models/productModel.js";
import { ObjectId } from "mongodb";

const sortObjects = [
  { code: "name_ASC", name: "Tên sản phẩm tăng dần" },
  { code: "name_DESC", name: "Tên sản phẩm giảm dần" },
  { code: "code_ASC", name: "Mã sản phẩm tăng dần" },
  { code: "code_DESC", name: "Mã sản phẩm giảm dần" },
];

const sizes = ["S", "M", "L", "XL"];

const colors = ["red", "green", "black", "grey", "blue"];

// -----------------------------------------------------------------
// List products
export async function listProduct(req, res) {
  const search = req.query?.search;
  const pageSize = !!req.query.pageSize ? parseInt(req.query.pageSize) : 4;
  const page = !!req.query?.page ? parseInt(req.query.page) : 1;
  const skip = (page - 1) * pageSize;
  let sort = req.query?.sort || "createdAt_DESC";

  // Cấu hình lọc
  let filters = {
    deleteAt: null,
  };

  if (search && search.length > 0) {
    filters.searchString = {
      $regex: removeVietnameseAccents(search),
      $options: "i",
    };
  }

  let sortCriteria = {};
  const sortArray = sort.split("_");
  if (sortArray.length === 2) {
    sortCriteria[sortArray[0]] = sortArray[1] === "ASC" ? 1 : -1;
  } else {
    sortCriteria = { createdAt: -1 };
  }

  try {
    // Lấy tổng số lượng danh mục để tính phân trang
    const countCategories = await ProductModel.countDocuments(filters);

    const products = await ProductModel.find(filters)
      .populate("category")
      .sort(sortCriteria)
      .skip(skip)
      .limit(pageSize);

    // Trả kết quả về view
    res.render("pages/products/list", {
      title: "Products",
      products: products,
      countPagination: Math.ceil(countCategories / pageSize),
      pageSize,
      page,
      sort,
      sortObjects,
    });
  } catch (error) {
    console.log(error);
    res.send("Hiện tại không có sản phẩm");
  }
}

// -----------------------------------------------------------------
// Create products
export async function createProduct(req, res) {
  const categories = await CategoryModel.find({ deleteAt: null });
  const {
    sizes: productSize,
    colors: productColor,
    image,
    ...dataOther
  } = req.body;

  // console.log("req.body", req.body);

  let sizeArray = [],
    colorArray = [],
    imageString = typeof image === "string" ? image : "";

  if (typeof productSize === "string") {
    sizeArray = [productSize];
  } else if (Array.isArray(productSize)) {
    sizeArray = productSize;
  }

  if (typeof productColor === "string") {
    colorArray = [productColor];
  } else if (Array.isArray(productColor)) {
    colorArray = productColor;
  }

  if (typeof image === "string" && image.trim() !== "") {
    imageString = image.trim();
  }

  try {
    const product = await ProductModel.findOne({
      code: dataOther.code,
      deleteAt: null,
    });
    if (product) throw "code";

    await ProductModel.create({
      sizes: sizeArray,
      colors: colorArray,
      image: image?.trim() || "",
      ...dataOther,
      createdAt: new Date(),
    });
    res.redirect("/products");
  } catch (error) {
    console.log("err", err);

    let err = {};

    if (error === "code") err.code = "Mã sản phẩm này đã tồn tại";

    if (error.name === "ValidationError") {
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });
    }

    res.render("pages/products/form", {
      title: "Create products",
      mode: "Create",
      product: {
        sizes: sizeArray,
        colors: colorArray,
        image,
        ...dataOther,
      },
      sizes: sizeArray,
      colors: colorArray,
      categories: categories,
      err,
    });
  }
}

export async function renderPageCreateProduct(req, res) {
  const categories = await CategoryModel.find({ deleteAt: null });
  res.render("pages/products/form", {
    title: "Create products",
    mode: "Create",
    product: {},
    sizes: sizes,
    colors: colors,
    categories: categories,
    err: {},
  });
}

// -----------------------------------------------------------------
// Update products
export async function renderPageUpdateProduct(req, res) {
  try {
    const categories = await CategoryModel.find({ deleteAt: null });
    const { id } = req.params;
    const product = await ProductModel.findOne({
      _id: new ObjectId(id),
      deleteAt: null,
    });

    if (product) {
      res.render("pages/products/form", {
        title: "Cập nhật sản phẩm",
        mode: "Update",
        product: product,
        sizes: ["S", "M", "L", "XL"],
        colors: ["red", "green", "black", "grey", "blue"],
        categories: categories,
        err: {},
      });
    } else {
      res.send("Không tìm thấy sản phẩm.");
    }
  } catch (error) {
    console.log(error);
    res.send("Lỗi hệ thống.");
  }
}

export async function updateProduct(req, res) {
  const { id } = req.params;
  const { code, name, price, image, categoryId, sizes, colors } = req.body;

  try {
    const product = await ProductModel.findOne({
      _id: new ObjectId(id),
      deleteAt: null,
    });
    if (!product) {
      return res.send("Sản phẩm không tồn tại.");
    }

    const existingProduct = await ProductModel.findOne({
      code,
      deleteAt: null,
      _id: { $ne: new ObjectId(id) },
    });

    let err = {};
    if (existingProduct) {
      err.code = "Mã sản phẩm đã tồn tại.";
      throw err;
    }

    await ProductModel.updateOne(
      { _id: new ObjectId(id) },
      {
        code,
        name,
        price,
        image,
        categoryId: new ObjectId(categoryId),
        sizes: Array.isArray(sizes) ? sizes : [sizes],
        colors: Array.isArray(colors) ? colors : [colors],
        updatedAt: new Date(),
      }
    );

    res.redirect("/products");
  } catch (error) {
    console.log(error);

    res.render("pages/products/form", {
      title: "Cập nhật sản phẩm",
      mode: "Update",
      product: { id, code, name, price, image, categoryId, sizes, colors },
      categories: await CategoryModel.find({ deleteAt: null }),
      sizes: ["S", "M", "L", "XL"],
      colors: ["red", "green", "black", "grey", "blue"],
      err: error,
    });
  }
}

// -----------------------------------------------------------------
// Delete category
export async function deleteProduct(req, res) {
  try {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send("ID không hợp lệ.");
    }

    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).send("Sản phẩm không tồn tại.");
    }

    await ProductModel.deleteOne({ _id: new ObjectId(id) });

    res.redirect("/products");
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    res.status(500).send("Xóa sản phẩm không thành công.");
  }
}

export async function renderPageDeleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await ProductModel.findOne({ _id: new ObjectId(id) });
    const categories = await CategoryModel.find({ deleteAt: null });

    if (!product) {
      return res.send("Sản phẩm không tồn tại");
    }

    res.render("pages/products/form", {
      title: "Delete products",
      mode: "Delete",
      product: product,
      sizes: ["S", "M", "L", "XL"],
      colors: ["red", "green", "black", "grey", "blue"],
      categories: categories,
      err: {},
    });
  } catch (error) {
    console.error(error);
    res.send("Lỗi xảy ra khi tải trang xóa sản phẩm.");
  }
}
