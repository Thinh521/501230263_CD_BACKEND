import CategoryModel from "../models/cateroryModel.js";

const data = [
  {
    code: "A_0001",
    name: "Áo Nam",
    image: "product_2.jpg",
    searchString: "ao",
    createdAt: new Date(),
  },
  {
    code: "Q_0001",
    name: "Quần Nam",
    image: "product_1.jpg",
    searchString: "quan",
    createdAt: new Date(),
  },
  {
    code: "N_0001",
    name: "Nón",
    image: "product_3.jpg",
    searchString: "non",
    createdAt: new Date(),
  },
  {
    code: "G_0001",
    name: "Giày",
    image: "product_4.jpg",
    searchString: "giay",
    createdAt: new Date(),
  },
];

export default async function categorySeeder() {
  await CategoryModel.deleteMany();
  await CategoryModel.insertMany(data);
}
