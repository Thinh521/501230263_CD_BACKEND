import CategoryModel from "../models/cateroryModel.js";
import ProductModel from "../models/productModel.js";

const data = [
  {
    code: "AN_0001",
    name: "Áo Nữ",
    price: 1000000,
    images: "product_2.jpg",
    searchString: "ao nu",
    sizes: ["M", "L"],
    colors: ["red", "green"],
    active: true,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas rerum consequuntur et labore, accusantium consectetur similique, ut, quae ipsam perspiciatis voluptatem aut. Asperiores animi nesciunt laboriosam aperiam dicta corporis a.",
    information:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas rerum consequuntur et labore, accusantium consectetur similique, ut, quae ipsam perspiciatis voluptatem aut. Asperiores animi nesciunt laboriosam aperiam dicta corporis a.",
    categoryCode: "AN_001",
    createdAt: new Date(),
  },
  {
    code: "QN_0001",
    name: "Quần Nữ",
    price: 2000000,
    images: "product_1.jpg",
    searchString: "quan nu",
    sizes: ["S", "M", "L"],
    colors: ["green", "black", "grey"],
    active: true,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas rerum consequuntur et labore, accusantium consectetur similique, ut, quae ipsam perspiciatis voluptatem aut. Asperiores animi nesciunt laboriosam aperiam dicta corporis a.",
    information:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas rerum consequuntur et labore, accusantium consectetur similique, ut, quae ipsam perspiciatis voluptatem aut. Asperiores animi nesciunt laboriosam aperiam dicta corporis a.",
    categoryCode: "QN_001",
    createdAt: new Date(),
  },
  {
    code: "N_0001",
    name: "Nón Nữ",
    price: 1500000,
    images: "product_3.jpg",
    searchString: "non nu",
    sizes: ["S", "L"],
    colors: ["red", "green", "black", "grey", "blue"],
    active: true,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas rerum consequuntur et labore, accusantium consectetur similique, ut, quae ipsam perspiciatis voluptatem aut. Asperiores animi nesciunt laboriosam aperiam dicta corporis a.",
    information:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas rerum consequuntur et labore, accusantium consectetur similique, ut, quae ipsam perspiciatis voluptatem aut. Asperiores animi nesciunt laboriosam aperiam dicta corporis a.",
    categoryCode: "NN_001",
    createdAt: new Date(),
  },
  {
    code: "G_0001",
    name: "Giày Nữ",
    price: 3000000,
    images: "product_4.jpg",
    searchString: "giay nu",
    sizes: ["S", "M"],
    colors: ["black"],
    active: true,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas rerum consequuntur et labore, accusantium consectetur similique, ut, quae ipsam perspiciatis voluptatem aut. Asperiores animi nesciunt laboriosam aperiam dicta corporis a.",
    information:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas rerum consequuntur et labore, accusantium consectetur similique, ut, quae ipsam perspiciatis voluptatem aut. Asperiores animi nesciunt laboriosam aperiam dicta corporis a.",
    categoryCode: "GN_001",
    createdAt: new Date(),
  },
];

export default async function categorySeeder() {
  await ProductModel.deleteMany();
  const categories = await CategoryModel.find({});

  let writeProduct = [];

  for (let product in data) {
    const { categoryCode, ...dataOther } = data[product];
    const category = categories.find((categoryItem) => {
      return categoryItem.code === categoryCode;
    });

    writeProduct.push({
      categoryId: !!category ? category._id : null,
      ...dataOther,
    });
  }

  await ProductModel.insertMany(writeProduct);
}
