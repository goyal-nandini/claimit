import Claim from '../models/Claim.js';
import Item from '../models/Item.js';
import sendEmail from '../utils/sendEmail.js';

//  Create a claim 
const createClaim = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId)
      .populate('postedBy', 'name email');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.postedBy._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot claim your own item' });
    }

    if (item.status === 'resolved') {
      return res.status(400).json({ message: 'This item has already been resolved' });
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

    // Email the item owner — someone claimed their item
    await sendEmail({
      to: item.postedBy.email,
      subject: `ClaimIt — Someone claimed your item: ${item.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #7C3AED;">Someone claimed your item!</h2>
          <p>Hi ${item.postedBy.name},</p>
          <p>A user has submitted a claim for your item <strong>${item.title}</strong>.</p>
          <p>Log in to ClaimIt to review and approve or reject the claim.</p>
          <a href="${process.env.CLIENT_URL}/my-posts"
             style="display:inline-block; background:#7C3AED; color:white; padding:10px 20px; border-radius:8px; text-decoration:none; margin-top:12px;">
            Review Claim
          </a>
          <p style="color:#9CA3AF; font-size:12px; margin-top:24px;">ClaimIt — Campus Lost & Found</p>
        </div>
      `,
    });

    res.status(201).json(claim);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Approve a claim ─
const approveClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate({
        path: 'item',
        populate: { path: 'postedBy', select: 'name email' },
      })
      .populate('claimedBy', 'name email');

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    if (claim.item.postedBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to approve this claim' });
    }

    claim.status = 'approved';
    await claim.save();

    await Item.findByIdAndUpdate(claim.item._id, { status: 'resolved' });

    // Email the claimant — their claim was approved
    await sendEmail({
      to: claim.claimedBy.email,
      subject: `ClaimIt — Your claim was approved: ${claim.item.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #16A34A;">Your claim was approved! ✅</h2>
          <p>Hi ${claim.claimedBy.name},</p>
          <p>Great news! Your claim for <strong>${claim.item.title}</strong> has been approved.</p>
          <p>Contact the owner to arrange collection:</p>
          <p style="background:#F5F3FF; padding:12px; border-radius:8px;">
            <strong>${claim.item.postedBy.name}</strong><br/>
            <a href="mailto:${claim.item.postedBy.email}">${claim.item.postedBy.email}</a>
          </p>
          <a href="${process.env.CLIENT_URL}/my-claims"
             style="display:inline-block; background:#7C3AED; color:white; padding:10px 20px; border-radius:8px; text-decoration:none; margin-top:12px;">
            View My Claims
          </a>
          <p style="color:#9CA3AF; font-size:12px; margin-top:24px;">ClaimIt — Campus Lost & Found</p>
        </div>
      `,
    });

    res.status(200).json({ message: 'Claim approved', claim });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Reject a claim 
const rejectClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate({
        path: 'item',
        populate: { path: 'postedBy', select: 'name email' },
      })
      .populate('claimedBy', 'name email');

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    if (claim.item.postedBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to reject this claim' });
    }

    claim.status = 'rejected';
    await claim.save();

    // Email the claimant — their claim was rejected
    await sendEmail({
      to: claim.claimedBy.email,
      subject: `ClaimIt — Update on your claim: ${claim.item.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #DC2626;">Claim not approved</h2>
          <p>Hi ${claim.claimedBy.name},</p>
          <p>Unfortunately your claim for <strong>${claim.item.title}</strong> was not approved by the owner.</p>
          <p>This may mean the item belongs to someone else. Keep browsing — there may be other matching items.</p>
          <a href="${process.env.CLIENT_URL}/items"
             style="display:inline-block; background:#7C3AED; color:white; padding:10px 20px; border-radius:8px; text-decoration:none; margin-top:12px;">
            Browse Items
          </a>
          <p style="color:#9CA3AF; font-size:12px; margin-top:24px;">ClaimIt — Campus Lost & Found</p>
        </div>
      `,
    });

    res.status(200).json({ message: 'Claim rejected', claim });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Get claims for an item (owner view) ─
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

//  Get my claims (claimant view) ─
const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ claimedBy: req.user.id })
      .populate({
        path: 'item',
        select: 'title type location status imageURL postedBy',
        populate: { path: 'postedBy', select: 'name email' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(claims);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
  createClaim,
  approveClaim,
  rejectClaim,
  getClaimsForItem,
  getMyClaims,
};