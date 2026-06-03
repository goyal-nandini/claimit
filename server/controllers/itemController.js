import Item from "../models/Item.js";
import User from "../models/User.js";
import Claim from "../models/Claim.js";

// get all items
const getAllItems = async (req, res) => {
  try {
    const { search, type, category, status } = req.query;

    const filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Item.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get single item
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('postedBy', 'name email');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// create item (protected)
const createItem = async (req, res) => {
  try {
    const { title, description, category, type, location, date } = req.body;

    const imageURL = req.file ? req.file.path : '';

    const item = await Item.create({
      title,
      description,
      category,
      type,
      location,
      date,
      imageURL,
      postedBy: req.user.id,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update item (protected + owner only)
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }

      // returnDocument: "after"
    );

    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete item (protected + owner only)
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await Claim.deleteMany({ item: item._id });
    await item.deleteOne();

    await item.deleteOne();
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get my items
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStats = async (req, res) => {
  try {
    const totalItems = await Item.countDocuments();
    const resolvedItems = await Item.countDocuments({ status: 'resolved' });
    const totalUsers = await User.countDocuments();
    const totalClaims = await Claim.countDocuments();
    res.status(200).json({ totalItems, resolvedItems, totalUsers, totalClaims });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getAllItems, getItemById, createItem, updateItem, deleteItem, getMyItems, getStats };