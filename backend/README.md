# Books API Backend

Simple Node.js/Express API service for accessing books data from MongoDB.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Update `.env` file with your MongoDB connection

3. **Start the server:**
   ```bash
   npm start
   ```

## API Endpoints

### GET /api/books
Returns a paginated list of books with optional filtering and search.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20) - Items per page
- `rating` (number, 1-5) - Filter by star rating
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `inStock` (boolean) - Filter by stock status (true/false)
- `search` (string) - Search by book title

**Examples:**
```bash
GET /api/books
GET /api/books?rating=5
GET /api/books?minPrice=20&maxPrice=50
GET /api/books?inStock=true
GET /api/books?search=python
GET /api/books?rating=4&inStock=true&search=javascript
```

### GET /api/books/:id
Returns detailed information for a single book.

**Examples:**
```bash
GET /api/books/507f1f77bcf86cd799439011
GET /api/books/harry%20potter
```

## Response Format

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 50,
    "totalBooks": 1000,
    "hasNextPage": true,
    "hasPrevPage": false,
    "limit": 20
  },
  "filters": {
    "rating": null,
    "minPrice": null,
    "maxPrice": null,
    "inStock": null,
    "search": null
  }
}
```
