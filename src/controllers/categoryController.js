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
// try {
//   await CategoryModel.create({
//     code,
//     name,
//     image,
//   });
//   res.redirect("/categories");
// } catch (error) {
//   console.log(error);
//   res.send("Tao loai san pham khong thanh cong");
// }

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
  res.render("pages/categories/create", {
    title: "Create categories",
  });
}
