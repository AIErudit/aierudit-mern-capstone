import { Book } from "../models/Book.js";
import { Review } from "../models/Review.js";

/**
 * GET /api/v1/books
 *
 * Returns a paginated list of books, each with an average rating computed
 * from its reviews.
 *
 * CAPSTONE-BUG-5: After fetching the page of books, this handler iterates
 * each book and queries the Review collection once per book. With page
 * size 20 you observe 21 Mongoose queries in the debug log (one books
 * find + twenty review finds). Expected fix: either use a single
 * aggregation with $lookup + $group, or denormalize an `averageRating`
 * field onto the Book document and recompute it on Review create/update.
 */
export async function list(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize, 10) || 20));
    const skip = (page - 1) * pageSize;

    const filter = {};
    if (req.query.q) {
      filter.$or = [
        { title: { $regex: req.query.q, $options: "i" } },
        { author: { $regex: req.query.q, $options: "i" } },
      ];
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const [books, total] = await Promise.all([
      Book.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
      Book.countDocuments(filter),
    ]);

    // CAPSTONE-BUG-5 site:
    const enriched = [];
    for (const book of books) {
      const reviews = await Review.find({ book: book._id }).select("rating").lean();
      const ratingAvg =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : null;
      enriched.push({ ...book, ratingAvg, reviewsCount: reviews.length });
    }

    res.json({
      page,
      pageSize,
      total,
      items: enriched,
    });
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) {
      return res.status(404).json({ error: "not_found", message: "Book not found." });
    }
    const reviews = await Review.find({ book: book._id })
      .sort({ createdAt: -1 })
      .populate("user", "name")
      .lean();
    const ratingAvg =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null;
    res.json({ ...book, ratingAvg, reviewsCount: reviews.length, reviews });
  } catch (err) {
    next(err);
  }
}
