const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
let db;
let booksCollection;

async function connectToMongoDB() {
    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        db = client.db(process.env.DATABASE_NAME);
        booksCollection = db.collection(process.env.COLLECTION_NAME);
        console.log('✅ Successfully connected to MongoDB!');
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

// Helper function to parse price from string to number
function parsePrice(priceString) {
    if (!priceString) return 0;
    // Remove currency symbol and convert to float
    return parseFloat(priceString.replace(/[£$€,]/g, ''));
}

// Helper function to check if book is in stock
function isInStock(availability) {
    return availability && availability.toLowerCase().includes('in stock');
}

// GET /api/books - Returns paginated list of books with filters and search
app.get('/api/books', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            rating,
            minPrice,
            maxPrice,
            inStock,
            search
        } = req.query;

        // Build query object
        const query = {};

        // Rating filter
        if (rating) {
            query.Rating = parseInt(rating);
        }

        // Search by title (case-insensitive)
        if (search) {
            query.Title = { $regex: search, $options: 'i' };
        }

        // Stock status filter
        if (inStock !== undefined) {
            const stockStatus = inStock.toLowerCase() === 'true';
            if (stockStatus) {
                query.Availability = { $regex: 'in stock', $options: 'i' };
            } else {
                query.Availability = { $not: { $regex: 'in stock', $options: 'i' } };
            }
        }

        // Get all books first for price filtering (since prices are stored as strings)
        let books = await booksCollection.find(query).toArray();

        // Price range filter (after converting string prices to numbers)
        if (minPrice || maxPrice) {
            books = books.filter(book => {
                const price = parsePrice(book.Price);
                if (minPrice && price < parseFloat(minPrice)) return false;
                if (maxPrice && price > parseFloat(maxPrice)) return false;
                return true;
            });
        }

        // Calculate pagination
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const endIndex = startIndex + parseInt(limit);
        const paginatedBooks = books.slice(startIndex, endIndex);

        // Add computed fields
        const enrichedBooks = paginatedBooks.map(book => ({
            ...book,
            priceNumeric: parsePrice(book.Price),
            inStock: isInStock(book.Availability)
        }));

        // Pagination info
        const totalBooks = books.length;
        const totalPages = Math.ceil(totalBooks / parseInt(limit));
        const hasNextPage = parseInt(page) < totalPages;
        const hasPrevPage = parseInt(page) > 1;

        res.json({
            success: true,
            data: enrichedBooks,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalBooks,
                hasNextPage,
                hasPrevPage,
                limit: parseInt(limit)
            },
            filters: {
                rating: rating || null,
                minPrice: minPrice || null,
                maxPrice: maxPrice || null,
                inStock: inStock || null,
                search: search || null
            }
        });

    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// GET /api/books/:id - Returns detailed information for a single book
app.get('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Try to find by MongoDB ObjectId first
        let book;
        if (ObjectId.isValid(id)) {
            book = await booksCollection.findOne({ _id: new ObjectId(id) });
        }

        // If not found by ObjectId, try to find by title (fallback)
        if (!book) {
            book = await booksCollection.findOne({ Title: { $regex: id, $options: 'i' } });
        }

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Enrich book data
        const enrichedBook = {
            ...book,
            priceNumeric: parsePrice(book.Price),
            inStock: isInStock(book.Availability)
        };

        res.json({
            success: true,
            data: enrichedBook
        });

    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Start server
async function startServer() {
    await connectToMongoDB();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📚 Available API Endpoints:`);
        console.log(`   GET /api/books           - Get books with filters`);
        console.log(`   GET /api/books/:id       - Get single book`);
    });
}

startServer().catch(console.error);
