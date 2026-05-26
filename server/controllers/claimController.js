import Claim from '../models/Claim.js';
import Item from '../models/Item.js';

const createClaim = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.postedBy.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot claim your own item' });
    }

    const existingClaim = await Claim.findOne({
      item: req.params.itemId,
      claimedBy: req.user.id,
    });

    if (existingClaim) {
      return res.status(400).json({ message: 'You have already claimed this item' });
    }

    const claim = await Claim.create({
      item: req.params.itemId,
      claimedBy: req.user.id,
    });

    res.status(201).json(claim);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const approveClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate('item');
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    if (claim.item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to approve this claim' });
    }

    claim.status = 'approved';
    await claim.save();

    await Item.findByIdAndUpdate(claim.item._id, { status: 'resolved' });

    res.status(200).json({ message: 'Claim approved', claim });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const rejectClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate('item');
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    if (claim.item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to reject this claim' });
    }

    claim.status = 'rejected';
    await claim.save();

    res.status(200).json({ message: 'Claim rejected', claim });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getClaimsForItem = async (req, res) => {
  try {
    const claims = await Claim.find({ item: req.params.itemId })
      .populate('claimedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(claims);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ claimedBy: req.user.id })
      .populate('item', 'title type location status imageURL postedBy')
      .populate({
        path: 'item',
        populate: { path: 'postedBy', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(claims);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export{ createClaim, approveClaim, rejectClaim, getClaimsForItem, getMyClaims };