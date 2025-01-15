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
  const pageSize = !!req.query.pageSize ? parseInt(req.query.pageSize) : 5;
  const page = !!req.query?.page ? parseInt(req.query.page) : 1;
  const skip = (page - 1) * pageSize;
  const sort = !!req.query?.sort ? req.query.sort : null;

  let filters = {
    deleteAt: null,
  };

  if (search && search.length > 0) {
    filters.searchString = {
      $regex: removeVietnameseAccents(search),
      $options: "i",
    };
  }

  // Xử lý sắp xếp
  let sortCriteria = {};
  if (sort) {
    const [field, order] = sort.split("_");
    sortCriteria[field] = order === "ASC" ? 1 : -1;
  }

  try {
    const countCategories = await CategoryModel.countDocuments(filters);
    const categories = await CategoryModel.find(filters)
      .sort(sortCriteria) // Thêm sắp xếp tại đây
      .skip(skip)
      .limit(pageSize);

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
    await CategoryModel.create({
      ...data,
      createAt: new Date(),
    });
    res.redirect("/categories");
  } catch (error) {
    console.log(error);
    res.send("Tạo loại sản phẩm không thành công");
  }
}

export async function renderPageCreateCategory(req, res) {
  res.render("pages/categories/form", {
    title: "Create categories",
    mode: "Create",
    category: {},
  });
}

// -----------------------------------------------------------------
// Update category
export async function updateCaterory(req, res) {
  const { id, ...data } = req.body;

  try {
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
    res.send("Cập nhật sản phẩm không thành công");
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
      });
    } else {
      res.render("Hiện không có sản phẩm này");
    }
  } catch (error) {
    console.log(error);
    res.render("Trang web này không tồn tại");
  }
}
