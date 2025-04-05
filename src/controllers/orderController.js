import { removeVietnameseAccents } from "../common/index.js";
import OrderModel from "../models/orderModel.js";
import ProductModel from "../models/productModel.js";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

const sortObjects = [
  { code: "name_ASC", name: "Tên sản phẩm tăng dần" },
  { code: "name_DESC", name: "Tên sản phẩm giảm dần" },
  { code: "code_ASC", name: "Mã sản phẩm tăng dần" },
  { code: "code_DESC", name: "Mã sản phẩm giảm dần" },
];

const validSizes = ["S", "M", "L", "XL"];

const validColors = [
  "red",
  "green",
  "black",
  "gray",
  "blue",
  "yellow",
  "white",
];

export async function listOrder(req, res) {
  try {
    const search = req.query?.search || "";
    const pageSize = parseInt(req.query.pageSize) || 5;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * pageSize;
    let sort = req.query?.sort || "createdAt_DESC";

    let filters = { deleteAt: null };
    if (search) {
      filters.searchString = {
        $regex: removeVietnameseAccents(search),
        $options: "i",
      };
    }

    let sortCriteria = {};
    const [sortField, sortOrder] = sort.split("_");
    sortCriteria[sortField] = sortOrder === "ASC" ? 1 : -1;

    const countOrders = await OrderModel.countDocuments(filters);
    const orders = await OrderModel.find(filters)
      .sort(sortCriteria)
      .skip(skip)
      .limit(pageSize)
      .populate("orderItems.productId", "name code");

    res.render("pages/orders/list", {
      title: "Order",
      orders,
      countPagination: Math.ceil(countOrders / pageSize),
      pageSize,
      page,
      sort,
      sortObjects,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    res.status(500).send("Lỗi hệ thống");
  }
}

export async function renderPageSimulateCreateOrder(req, res) {
  try {
    const products = await ProductModel.find(
      { deleteAt: null },
      "code name price sizes colors"
    );
    res.render("pages/orders/form", {
      title: "Create Orders",
      mode: "Create",
      order: {},
      products,
      err: {},
    });
  } catch (error) {
    console.error("Lỗi khi render trang tạo đơn hàng:", error);
    res.status(500).send("Lỗi hệ thống");
  }
}

export async function createOrder(req, res) {
  try {
    const { discount = 0, orderItems, billingAddress } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Đơn hàng phải có ít nhất một sản phẩm" });
    }

    let subTotal = 0;
    const lastOrder = await OrderModel.findOne().sort({ numericalOrder: -1 });
    const numericalOrder = lastOrder ? lastOrder.numericalOrder + 1 : 1;
    const orderNo = `order-${numericalOrder}`;

    for (const item of orderItems) {
      if (!ObjectId.isValid(item.productId)) {
        return res
          .status(400)
          .json({ message: `ID sản phẩm không hợp lệ: ${item.productId}` });
      }

      const product = await ProductModel.findById(new ObjectId(item.productId));
      if (!product) {
        return res
          .status(400)
          .json({ message: `Sản phẩm với ID ${item.productId} không tồn tại` });
      }

      item.productName = product.name;
      item.color = validColors.includes(item.color) ? item.color : "black";
      item.size = validSizes.includes(item.size) ? item.size : "M";
      item.total = item.quantity * item.price;
      subTotal += item.total;
    }

    const total = (subTotal * (100 - discount)) / 100;

    const newOrder = new OrderModel({
      orderNo,
      discount,
      total,
      status: "created",
      orderItems,
      numericalOrder,
      createdAt: new Date(),
      billingAddress,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
}

export async function simulatorCreateOrder(req, res) {
  try {
    const {
      discount = 0,
      itemSelect = [],
      quantity = [],
      itemColor = [],
      itemSize = [],
      itemPrice = [],
      billingName,
      billingEmail,
      billingPhone,
      billingAddress,
      billingDistrict,
      billingCity,
    } = req.body;

    if (!itemSelect.length) {
      return res.status(400).send("Đơn hàng phải có ít nhất một sản phẩm");
    }

    let subTotal = 0;
    const lastOrder = await OrderModel.findOne().sort({ numericalOrder: -1 });
    let numericalOrder = lastOrder ? lastOrder.numericalOrder + 1 : 1;

    let orderNo;
    do {
      orderNo = `order-${numericalOrder}`;
      numericalOrder++;
    } while (await OrderModel.findOne({ orderNo }));

    const orderItems = [];
    for (let i = 0; i < itemSelect.length; i++) {
      if (!ObjectId.isValid(itemSelect[i])) {
        return res
          .status(400)
          .send(`ID sản phẩm không hợp lệ: ${itemSelect[i]}`);
      }

      const product = await ProductModel.findById(itemSelect[i]);
      if (!product) {
        return res.status(400).send("Sản phẩm không tồn tại");
      }

      orderItems.push({
        productId: new ObjectId(itemSelect[i]),
        productName: product.name,
        quantity: parseInt(quantity[i]),
        price: parseFloat(itemPrice[i]),
        color: validColors.includes(itemColor[i]) ? itemColor[i] : "black",
        size: validSizes.includes(itemSize[i]) ? itemSize[i] : "M",
        total: parseInt(quantity[i]) * parseFloat(itemPrice[i]), // Thêm dòng này
      });

      subTotal += parseInt(quantity[i]) * parseFloat(itemPrice[i]);
    }

    const total = (subTotal * (100 - discount)) / 100;
    const newOrder = new OrderModel({
      orderNo,
      discount,
      total,
      status: "created",
      orderItems,
      numericalOrder,
      createdAt: new Date(),
      billingAddress: {
        name: billingName,
        email: billingEmail,
        phoneNumber: billingPhone,
        address: billingAddress,
        district: billingDistrict,
        city: billingCity,
      },
    });

    await newOrder.save();
    res.redirect("/orders");
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    res.status(500).send("Lỗi hệ thống khi tạo đơn hàng");
  }
}

export async function renderCancelOrderForm(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send("ID đơn hàng không hợp lệ.");
    }

    const order = await OrderModel.findOne({
      _id: new ObjectId(id),
      deleteAt: null,
    });

    if (!order) {
      return res.status(404).send("Đơn hàng không tồn tại.");
    }
  } catch (error) {
    console.error("Lỗi khi tải form hủy đơn hàng:", error);
    res.status(500).send("Lỗi hệ thống.");
  }
}

export async function detail(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send("ID đơn hàng không hợp lệ.");
    }

    const order = await OrderModel.findById(id).populate(
      "orderItems.productId",
      "name code price"
    );

    if (!order) {
      return res.status(404).render("pages/error", {
        message: "Đơn hàng không tồn tại.",
      });
    }

    // Truyền biến `order` vào template
    res.render("pages/orders/detail", {
      title: "Chi tiết đơn hàng",
      order, // Đảm bảo biến `order` được truyền vào đây
      successMessage: "Dữ liệu đơn hàng đã được tải thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đơn hàng:", error);
    res.status(500).render("pages/error", { message: "Lỗi hệ thống", error });
  }
}
