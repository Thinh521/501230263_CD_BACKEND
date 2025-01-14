import CategoryModel from "../models/cateroryModel.js";
import { ObjectId } from "mongodb";

export async function listCaterory(req, res) {
  try {
    const categories = await CategoryModel.find();
    res.render("pages/categories/list", {
      title: "Categories",
      categories: categories,
    });
  } catch (error) {
    console.log(error);
    res.send("Hien tai khong co san pham");
  }
}

export async function createCaterory(req, res) {
  const { code, name, image } = req.body;

  try {
    await CategoryModel.create({
      code,
      name,
      image,
      createAt: new Date(),
    });
    res.redirect("/categories");
  } catch (error) {
    console.log(error);
    res.send("Tao loai san pham khong thanh cong");
  }
}

export async function renderPageCreateCategory(req, res) {
  res.render("pages/categories/form", {
    title: "Create categories",
    mode: "Create",
    category: {},
  });
}

export async function updateCaterory(req, res) {
  const { code, name, image, id } = req.body;

  try {
    await CategoryModel.updateOne(
      { _id: new ObjectId(id) },
      {
        code,
        name,
        image,
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
  const { id } = req.params;
  const category = await CategoryModel.findOne({ _id: new ObjectId(id) });
  if (category) {
    res.render("pages/categories/form", {
      title: "Create categories",
      mode: "Update",
      category: category,
    });
  } else {
    res.render("Hiện không có sản phẩm này");
  }
}
