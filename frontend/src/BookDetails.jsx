import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBookById } from './api';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchBookById(id);
        
        if (response.success) {
          setBook(response.data);
        } else {
          setError('Book not found');
        }
      } catch (err) {
        setError('Failed to load book details. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBook();
    }
  }, [id]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i 
        key={i} 
        className={`bi ${i < rating ? 'bi-star-fill' : 'bi-star'} rating-stars`}
      ></i>
    ));
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h5>Error</h5>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          <h5>Book Not Found</h5>
          <p>The book you're looking for doesn't exist.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Back Button */}
      <button 
        className="btn btn-outline-primary mb-4"
        onClick={() => navigate('/')}
      >
        <i className="bi bi-arrow-left me-2"></i>
        Back to Books
      </button>

      <div className="row">
        {/* Book Image */}
        <div className="col-md-4 mb-4">
          <div className="text-center">
            <img 
              src={book['Thumbnail URL']} 
              alt={book.Title}
              className="img-fluid rounded shadow book-detail-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x600?text=No+Image';
              }}
            />
          </div>
        </div>

        {/* Book Details */}
        <div className="col-md-8">
          <div className="book-details">
            <h1 className="mb-3">{book.Title}</h1>
            
            {/* Rating */}
            <div className="mb-3">
              <div className="d-flex align-items-center">
                {renderStars(book.Rating)}
                <span className="ms-2 text-muted">({book.Rating} out of 5 stars)</span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-4">
              <h3 className="text-success">{book.Price}</h3>
            </div>

            {/* Availability */}
            <div className="mb-4">
              <span className={`badge fs-6 ${book.inStock ? 'bg-success' : 'bg-danger'}`}>
                {book.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Additional Details */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Book Details</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-6 mb-3">
                    <strong>Product Type:</strong>
                    <p className="mb-0">{book['Product Type'] || 'Book'}</p>
                  </div>
                  
                  <div className="col-sm-6 mb-3">
                    <strong>Stock Status:</strong>
                    <p className="mb-0">{book.inStock ? 'Available' : 'Currently Unavailable'}</p>
                  </div>
                  
                  <div className="col-sm-6 mb-3">
                    <strong>Rating:</strong>
                    <p className="mb-0">{book.Rating} out of 5 stars</p>
                  </div>
                  
                  <div className="col-sm-6 mb-3">
                    <strong>Price:</strong>
                    <p className="mb-0">{book.Price}</p>
                  </div>

                  {book.UPC && (
                    <div className="col-sm-6 mb-3">
                      <strong>UPC:</strong>
                      <p className="mb-0">{book.UPC}</p>
                    </div>
                  )}

                  {book['Price (excl. tax)'] && (
                    <div className="col-sm-6 mb-3">
                      <strong>Price (excl. tax):</strong>
                      <p className="mb-0">{book['Price (excl. tax)']}</p>
                    </div>
                  )}

                  {book['Price (incl. tax)'] && (
                    <div className="col-sm-6 mb-3">
                      <strong>Price (incl. tax):</strong>
                      <p className="mb-0">{book['Price (incl. tax)']}</p>
                    </div>
                  )}

                  {book.Tax && (
                    <div className="col-sm-6 mb-3">
                      <strong>Tax:</strong>
                      <p className="mb-0">{book.Tax}</p>
                    </div>
                  )}

                  {book.Availability && (
                    <div className="col-sm-6 mb-3">
                      <strong>Availability:</strong>
                      <p className="mb-0">{book.Availability}</p>
                    </div>
                  )}

                  {book['Number of reviews'] && (
                    <div className="col-sm-6 mb-3">
                      <strong>Number of Reviews:</strong>
                      <p className="mb-0">{book['Number of reviews']}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4">
              <button 
                className={`btn btn-lg ${book.inStock ? 'btn-success' : 'btn-secondary'} me-3`}
                disabled={!book.inStock}
              >
                <i className="bi bi-cart-plus me-2"></i>
                {book.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              <button className="btn btn-outline-primary btn-lg">
                <i className="bi bi-heart me-2"></i>
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
