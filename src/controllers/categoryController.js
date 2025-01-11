import CategoryModel from "../models/cateroryModel.js";

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
