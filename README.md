# 📚 Book Explorer

A modern web application for exploring and discovering books with a beautiful user interface. Built with React, Node.js, and web scraping technologies.

![Book Explorer](https://raw.githubusercontent.com/Prateek17904/book-explorer/main/frontend/public/app-preview.png)

## 🌟 Features

- **Modern UI/UX**: Clean and aesthetic design with a soft pink color scheme
- **Real-time Search**: Instant book search functionality
- **Detailed Book Information**: View comprehensive details about each book
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Book Rating System**: View ratings and reviews for books
- **Web Scraping**: Automated data collection from book websites

## 🛠️ Technologies Used

### Frontend
- React.js
- Vite
- CSS3 with modern features
- Bootstrap 5
- React Router DOM
- Axios for API calls

### Backend
- Node.js
- Express.js
- Python (for web scraping)
- Beautiful Soup 4

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.x
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Prateek17904/book-explorer.git
   cd book-explorer
   ```

2. Install Python dependencies
   ```bash
   pip install -r requirements.txt
   ```

3. Install Backend dependencies
   ```bash
   cd backend
   npm install
   ```

4. Install Frontend dependencies
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. Start the Python scraper
   ```bash
   python scrapper.py
   ```

2. Start the backend server
   ```bash
   cd backend
   npm run dev
   ```

3. Start the frontend development server
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use)

## 🎨 Project Structure

```
book-explorer/
├── scrapper.py              # Python web scraping script
├── requirements.txt         # Python dependencies
├── backend/                 # Node.js backend
│   ├── server.js           # Express server setup
│   └── package.json        # Backend dependencies
└── frontend/               # React frontend
    ├── src/
    │   ├── components/     # React components
    │   ├── App.jsx        # Main application component
    │   └── App.css        # Application styles
    └── package.json       # Frontend dependencies
```

## 🔧 Configuration

- Backend runs on port 3000 by default
- Frontend development server runs on port 5173 by default
- Configure environment variables if needed for different ports or API endpoints

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Author

**Prateek Dave**
- GitHub: [@Prateek17904](https://github.com/Prateek17904)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all the open-source libraries used in this project
- Inspired by modern book discovery platforms
- Special thanks to the React and Node.js communities

---
Made with ❤️ by Prateek Dave
