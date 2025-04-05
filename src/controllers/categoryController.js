import { removeVietnameseAccents } from "../common/index.js";
import CategoryModel from "../models/cateroryModel.js";
import { ObjectId } from "mongodb";

const sortObjects = [
  { code: "name_ASC", name: "Tên sản phẩm tăng dần" },
  { code: "name_DESC", name: "Tên sản phẩm giảm dần" },
  { code: "code_ASC", name: "Mã sản phẩm tăng dần" },
  { code: "code_DESC", name: "Mã sản phẩm giảm dần" },
];

// -----------------------------------------------------------------
// List category
export async function listCaterory(req, res) {
  const search = req.query?.search;
  const pageSize = !!req.query.pageSize ? parseInt(req.query.pageSize) : 4;
  const page = !!req.query?.page ? parseInt(req.query.page) : 1;
  const skip = (page - 1) * pageSize;
  let sort = req.query?.sort || "createdAt_DESC"; // Default sort if no sort parameter is given

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

  // Phân tích giá trị sort và áp dụng vào đối tượng sortCriteria
  let sortCriteria = {};
  const sortArray = sort.split("_");
  if (sortArray.length === 2) {
    sortCriteria[sortArray[0]] = sortArray[1] === "ASC" ? 1 : -1;
  } else {
    sortCriteria = { createdAt: -1 }; // Mặc định sắp xếp theo thời gian tạo giảm dần
  }

  try {
    // Lấy tổng số lượng danh mục để tính phân trang
    const countCategories = await CategoryModel.countDocuments(filters);

    const categories = await CategoryModel.find(filters)
      .sort(sortCriteria)
      .skip(skip)
      .limit(pageSize);

    // Trả kết quả về view
    res.render("pages/categories/list", {
      title: "Categories",
      categories: categories,
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
// Create category
export async function createCaterory(req, res) {
  const data = req.body;

  try {
    const categoryExists = await CategoryModel.findOne({
      code: data.code,
      deleteAt: null,
    });
    if (categoryExists) throw "code";

    await CategoryModel.create({
      ...data,
      createdAt: new Date(),
    });
    res.redirect("/categories");
  } catch (error) {
    let err = {};

    if (error === "code") err.code = "Mã sản phẩm này đã tồn tại";

    if (error.name === "ValidationError") {
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });
    }
    console.log("err", err);

    res.render("pages/categories/form", {
      title: "Create categories",
      mode: "Create",
      category: { ...data },
      err,
    });
  }
}

export async function createCategoryByModal(req, res) {
  const data = req.body;

  try {
    const category = await CategoryModel.create({
      ...data,
      createdAt: new Date(),
    });
    res.json({ success: true, category: category });
  } catch (error) {
    console.log(error);
    res.json({ success: false, category: {} });
  }
}

export async function renderPageCreateCategory(req, res) {
  res.render("pages/categories/form", {
    title: "Create categories",
    mode: "Create",
    category: {},
    err: {},
  });
}

// -----------------------------------------------------------------
// Update category
export async function updateCaterory(req, res) {
  const data = req.body;
  const { id } = req.params;

  try {
    const existingCategory = await CategoryModel.findOne({
      code: data.code,
      deleteAt: null,
      _id: { $ne: new ObjectId(id) },
    });

    let err = {};
    if (existingCategory) {
      err.code = "Mã sản phẩm này đã tồn tại";
      throw err;
    }

    // Cập nhật danh mục
    await CategoryModel.updateOne(
      { _id: new ObjectId(id) },
      {
        ...data,
        updateAt: new Date(),
      }
    );

    res.redirect("/categories");
  } catch (error) {
    console.log(error);
    res.render("pages/categories/form", {
      title: "Update categories",
      mode: "Update",
      category: { ...data, id },
      err: error,
    });
  }
}

export async function renderPageUpdateCategory(req, res) {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findOne({
      _id: new ObjectId(id),
      deleteAt: null,
    });
    if (category) {
      res.render("pages/categories/form", {
        title: "Create categories",
        mode: "Update",
        category: category,
        err: {},
      });
    } else {
      res.render("Hiện không có sản phẩm nào phù hợp");
    }
  } catch (error) {
    console.log(error);
    res.render("Trang web này không tồn tại");
  }
}

// -----------------------------------------------------------------
// Delete category
export async function deleteCaterory(req, res) {
  const { id } = req.body;

  try {
    await CategoryModel.updateOne(
      { _id: new ObjectId(id) },
      {
        deleteAt: new Date(),
      }
    );
    res.redirect("/categories");
  } catch (error) {
    console.log(error);
    res.send("Xóa sản phẩm không thành công");
  }
}

export async function renderPageDeleteCategory(req, res) {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findOne({
      _id: new ObjectId(id),
      deleteAt: null,
    });
    if (category) {
      res.render("pages/categories/form", {
        title: "Delete categories",
        mode: "Delete",
        category: category,
        err: {},
      });
    } else {
      res.render("Hiện không có sản phẩm này");
    }
  } catch (error) {
    console.log(error);
    res.render("Trang web này không tồn tại");
  }
}
