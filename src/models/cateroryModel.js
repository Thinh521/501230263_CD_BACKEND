import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    code: String,
    name: String,
    image: String,
    createAt: Date,
  },
  {
    versionKey: false,
    collection: "categories",
  }
);

const CategoryModel = mongoose.model("Category", categorySchema);
export default CategoryModel;
