import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Bắt buộc phải nhập mã sản phẩm"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Bắt buộc phải nhập tên"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Bắt buộc phải nhập giá sản phẩm"],
    },
    searchString: {
      type: String,
      required: [true, "Bắt buộc phải nhập chuỗi tìm kiếm"],
      trim: true,
    },
    sizes: {
      type: [String],
      enum: ["S", "M", "L", "XL"],
      default: [],
      required: true,
    },
    colors: {
      type: [String],
      enum: ["red", "green", "black", "grey", "blue"],
      default: [],
      required: true,
    },
    active: String,
    description: String,
    information: String,
    image: {
      type: String,
      trim: true, // Loại bỏ khoảng trắng không cần thiết
      required: [true, "Bắt buộc phải nhập link hình ảnh"],
    },
    categoryId: Schema.Types.ObjectId,

    createAt: Date,
    updateAt: Date,
    deleteAt: Date,
  },
  {
    versionKey: false,
    collection: "products",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("category", {
  ref: "Category",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true,
});

productSchema.virtual("categoryIdString").get(function () {
  return !!this.categoryId ? this.categoryId.toString() : "";
});

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
