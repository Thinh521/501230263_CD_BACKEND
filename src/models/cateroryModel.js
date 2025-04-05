import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Bắt buộc phải nhập mã loại sản phẩm"],
      minLength: [5, "Mã loại sản phẩm có độ dài từ 5 đến 10 kí tự"],
      maxLength: [10, "Mã loại sản phẩm có độ dài từ 5 đến 10 kí tự"],
    },
    name: {
      type: String,
      required: [true, "Bắt buộc phải nhập tên"],
    },
    image: {
      type: String,
      required: [true, "Bắt buộc phải nhập link ảnh"],
    },
    searchString: {
      type: String,
      required: [true, "Bắt buộc phải nhập chuỗi tìm kiếm"],
    },
    createAt: Date,
    updateAt: Date,
    deleteAt: Date,
  },
  {
    versionKey: false,
    collection: "categories",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

categorySchema.virtual("id").get(function () {
  return this.categoryId.toString();
});

const CategoryModel = mongoose.model("Category", categorySchema);
export default CategoryModel;
