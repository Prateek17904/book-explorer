import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from './api';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    rating: '',
    minPrice: '',
    maxPrice: '',
    inStock: ''
  });
  
  const navigate = useNavigate();

  const loadBooks = async (page = 1, searchFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      const params = { page, limit: 20 };
      
      if (searchFilters.search.trim()) params.search = searchFilters.search.trim();
      if (searchFilters.rating) params.rating = searchFilters.rating;
      if (searchFilters.minPrice) params.minPrice = searchFilters.minPrice;
      if (searchFilters.maxPrice) params.maxPrice = searchFilters.maxPrice;
      if (searchFilters.inStock) params.inStock = searchFilters.inStock;

      const response = await fetchBooks(params);
      
      if (response.success) {
        setBooks(response.data);
        setCurrentPage(response.pagination.currentPage);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (err) {
      setError('Failed to load books. Make sure the backend is running on port 3000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadBooks(1, filters);
  };

  const handlePageChange = (page) => {
    loadBooks(page, filters);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i 
        key={i} 
        className={`bi ${i < rating ? 'bi-star-fill' : 'bi-star'} rating-stars`}
      ></i>
    ));
  };

  const clearFilters = () => {
    const emptyFilters = { search: '', rating: '', minPrice: '', maxPrice: '', inStock: '' };
    setFilters(emptyFilters);
    loadBooks(1, emptyFilters);
  };

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h5>Error</h5>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => loadBooks()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Search and Filters */}
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by title..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.rating}
                onChange={(e) => setFilters({...filters, rating: e.target.value})}
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.inStock}
                onChange={(e) => setFilters({...filters, inStock: e.target.value})}
              >
                <option value="">All Books</option>
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>
          </div>
          
          <div className="row mt-3">
            <div className="col">
              <button type="submit" className="btn btn-primary me-2" disabled={loading}>
                <i className="bi bi-search me-1"></i>
                Search
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={clearFilters}>
                <i className="bi bi-arrow-clockwise me-1"></i>
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Books Grid */}
      {!loading && books.length > 0 && (
        <>
          <div className="row">
            {books.map((book) => (
              <div key={book._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div 
                  className="card book-card h-100"
                  onClick={() => navigate(`/book/${book._id}`)}
                >
                  <img 
                    src={book['Thumbnail URL']} 
                    className="card-img-top book-image" 
                    alt={book.Title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title">
                      {book.Title.length > 50 ? `${book.Title.substring(0, 50)}...` : book.Title}
                    </h6>
                    
                    <div className="mb-2">
                      {renderStars(book.Rating)}
                    </div>
                    
                    <p className="text-success fw-bold mb-2">{book.Price}</p>
                    
                    <div className="mt-auto">
                      <span className={`badge ${book.inStock ? 'bg-success' : 'bg-danger'}`}>
                        {book.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, currentPage - 2) + i;
                  if (page <= totalPages) {
                    return (
                      <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </li>
                    );
                  }
                  return null;
                })}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}

      {/* No Results */}
      {!loading && books.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-search display-1 text-muted"></i>
          <h4 className="mt-3">No books found</h4>
          <p className="text-muted">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
