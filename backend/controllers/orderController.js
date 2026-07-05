import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";

export const placeOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice, paymentStatus } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      totalPrice,
      paymentStatus: paymentStatus || "pending",
      status: "pending",
    });

    const createdOrder = await order.save();

    return res.status(201).json({
      order: createdOrder,
      razorpayOrder: req.razorpayOrder ?? null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error creating order" });
  }
}

export const getMyOrders = async (req, res) => {
  try {
    // Find all orders where the 'user' field matches the logged-in user's ID
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.menuItem', 'name');
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};


// @desc    Get a single order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    // 1. Find the order by its ID from the URL
    // 2. Also 'populate' the user field: replaces the user ID
    //    with the user's name and email.
    const order = await Order.findById(req.params.id)
      .populate('user', 'username email')
      .populate('orderItems.menuItem', 'name');

    if (order) {
      // 3. Security Check:
      //    Is the logged-in user an admin?
      //    OR does this order belong to the logged-in user?
      if (req.user.isAdmin || order.user._id.equals(req.user._id)) {
        res.status(200).json(order);
      } else {
        res.status(401).json({ message: 'Not authorized to view this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching order' });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    // Find all orders and populate with user info
    const orders = await Order.find({})
      .populate('user', 'id username email')
      .populate('orderItems.menuItem', 'name');
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching all orders' });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Get the new status from the request body
      const { status } = req.body;

      // You could also update paymentStatus here
      // const { status, paymentStatus } = req.body;

      order.status = status || order.status;
      // order.paymentStatus = paymentStatus || order.paymentStatus;

      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);

    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating order status' });
  }
};