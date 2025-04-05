import mongoose from "mongoose";
const { Schema, ObjectId } = mongoose;

const orderItemSchema = new Schema(
  {
    productId: { type: ObjectId, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    color: {
      type: String,
      enum: ["red", "green", "yellow", "white", "black"],
      required: true,
    },
    size: {
      type: String,
      enum: ["S", "M", "L", "XL"],
      required: true,
    },
  },
  { versionKey: false }
);

const billingAddressSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
  },
  { versionKey: false, _id: false }
);

const orderSchema = new Schema(
  {
    orderNo: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled", "delivering", "created"],
      default: "created",
    },
    orderItems: { type: [orderItemSchema], required: true },
    billingAddress: { type: billingAddressSchema, required: true },
    total: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    numericalOrder: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    deletedAt: { type: Date },
  },
  {
    versionKey: false,
    collection: "orders",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
