import requests
from bs4 import BeautifulSoup
import os
from pymongo import MongoClient
from datetime import datetime

# MongoDB connection
MONGO_CONNECTION_STRING = "mongodb+srv://yuvvrajsinghhrathore:D74rajpcdARqiuTJ@cluster0.owsctzu.mongodb.net/"
DATABASE_NAME = "books_scraper"
COLLECTION_NAME = "books"

# Initialize MongoDB connection
def init_mongodb():
    try:
        client = MongoClient(MONGO_CONNECTION_STRING)
        db = client[DATABASE_NAME]
        collection = db[COLLECTION_NAME]
        # Test the connection
        client.admin.command('ping')
        print("Successfully connected to MongoDB!")
        return collection
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return None

# Base URL of the website
base_url = 'https://books.toscrape.com/catalogue/page-{}.html'
book_base_url = 'https://books.toscrape.com/catalogue/'

# Create directories if they don't exist
os.makedirs('images', exist_ok=True)

# List to store book details (for counting purposes)
book_count = 0

# Function to extract data from a single page
def extract_data_from_page(soup, page, mongo_collection):
    global book_count
    for book in soup.find_all('article', class_='product_pod'):
        title = book.h3.a['title']
        price = book.find('p', class_='price_color').text
        availability = book.find('p', class_='instock availability').text.strip()
        rating_text = book.p['class'][1]
        rating = convert_rating_to_number(rating_text)
        link = book_base_url + book.h3.a['href']
        thumbnail_url = 'https://books.toscrape.com/' + book.find('img', class_='thumbnail')['src']
        thumbnail_file_name = save_thumbnail_image(thumbnail_url, title)
        
        book_data = {
            'Title': title,
            'Price': price,
            'Availability': availability,
            'Rating': rating,
            'Link': link,
            'Thumbnail URL': thumbnail_url,
            'Thumbnail File Name': thumbnail_file_name,
            'Scraped At': datetime.now(),
            'Page': page
        }
        
        book_count += 1
        
        # Insert into MongoDB if connection is available
        if mongo_collection is not None:
            try:
                mongo_collection.insert_one(book_data.copy())
                print(f"✓ Inserted '{title}' into MongoDB")
            except Exception as e:
                print(f"✗ Error inserting '{title}' into MongoDB: {e}")
        else:
            print(f"⚠️ MongoDB not available - skipping '{title}'")
        
        # Print the extracted data to the console in a formatted way
        print(f"Page: {page}")
        print(f"Title: {title}")
        print(f"Price: {price}")
        print(f"Availability: {availability}")
        print(f"Rating: {rating}")
        print(f"Link: {link}")
        print(f"Thumbnail URL: {thumbnail_url}")
        print(f"Thumbnail File Name: {thumbnail_file_name}")
        print("="*50)

# Function to convert rating text to a number
def convert_rating_to_number(rating_text):
    rating_dict = {
        'One': 1,
        'Two': 2,
        'Three': 3,
        'Four': 4,
        'Five': 5
    }
    return rating_dict.get(rating_text, 0)

# Function to save thumbnail image
def save_thumbnail_image(url, title):
    response = requests.get(url)
    sanitized_title = "".join([c if c.isalnum() else "_" for c in title])
    image_path = os.path.join('images', f"{sanitized_title}.jpg")
    with open(image_path, 'wb') as file:
        file.write(response.content)
    return image_path

# Initialize MongoDB connection
mongo_collection = init_mongodb()

# Loop through the first 10 pages
for page in range(1, 2):  # Scraping the first 10 pages
    url = base_url.format(page)
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    extract_data_from_page(soup, page, mongo_collection)
    print(f"Extracted data from page {page}")

print(f"\n🎉 Scraping completed!")
print(f"📊 Total books processed: {book_count}")

if mongo_collection is not None:
    total_books_in_db = mongo_collection.count_documents({})
    print(f"📚 Total books in MongoDB: {total_books_in_db}")
else:
    print("❌ MongoDB connection was not available")