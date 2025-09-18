## Project Overview
Mongo Project - Quad EM  
A course project where we built a MongoDB-based system with backend APIs and frontend features.  

## My Contributions
- Developed backend APIs with focus on user search filter API.  
- Worked on frontend UI integration for search and filtering.  
- Collaborated in debugging and assisted teammates across different parts of the project.  

## Team
This was a group project completed with:  
- Farheen Haniyah – frontend development, geospatial API + UI  
- Joann Mathews – frontend development, date filter API + UI  
- Praislin Peter – backend lead, debugging  
- Garima Singh – backend APIs (user search filter), UI integration, debugging support  
**Technology Stack**

Backend
- FastAPI (Python): FastAPI was used to build the backend API because it is lightweight, modern, and automatically generates interactive documentation, thus making development and testing easier.
- MongoDB: MongoDB was chosen as the database because of its flexibility with unstructured data and its support for geospatial queries, which helped us filter observations based on location.
- Pymongo & GridFS: Pymongo is the official Python driver for MongoDB, and GridFS allows us to store and retrieve image files associated with observations.

Frontend
- React + Vite: React was selected for building reusable UI components efficiently. Vite offers fast development and hot module replacement, which improved our development speed.
- CSS: We used plain CSS for styling to keep the project light and simple.

Tools & Utilities
- GitHub: For collaboration.
- Postman: Used during development to test API endpoints.
- VS Code: Primary code editor used for development.

**Process**

We downloaded our dataset from the iNaturalist website: https://www.inaturalist.org/observations?place_id=any&view=species
which had approximately 100,000 image URLS. Initially, we tried using this dataset as-is and then dynamically fetching the images, but this process was very slow on RLES. So we decided to download all the images on our local machine using a Python script and then uploading the data on RLES. These images totaled to 13GB even after compression which created additional challenges in terms of upload time.

Finally, we used  another Python script to populate our MongoDB database. This script began by establishing a connection to the MongoDB server. It also ensured that the database had a 2dsphere geospatial index on the location field, which was important for our location-based queries.

The script then read data from the CSV file,  and for each row, it converted the latitude and longitude into a GeoJSON “Point” object. It also checked if an image_url is present, or if the image already exists locally; if so, or after downloading it, the image’s binary data was stored directly into MongoDB using GridFS.

To make sure the uploading process was efficient, the documents were inserted in batches of 100 and parallel processing was utilized. 

**Volume**  
Each document has an image file.  
<img width="445" alt="image" src="https://github.com/user-attachments/assets/136a7228-8e2b-4e96-a615-65d1a199792c" />

```bash
switched to db observations_db
observations_db> db.observations.countDocuments()
122499
observations_db> db.fs.files.countDocuments()
122499
observations_db> db.fs.chunks.countDocuments()
125928
```

**Variety** 

The **Wildlife Observation App** specializes in **ray-finned fishes (Actinopterygii)** and supports powerful, flexible search capabilities. A **species name or general query is required** to perform a search — this can be a **common name** like `"green sunfish"` or `"trout"`, or a **scientific name** like `"Lepomis"` or `"Micropterus"`.
Our database contains data about **northern america including the atlantic ocean.**
Additional **optional filters** can be applied to refine the results:

- **User login** (`user_login`) — filter by who submitted the observation  
- **Date range** (`start_date`, `end_date`) — narrow results to a specific timeframe  
- **Geolocation** (`lat`, `lng`, `radius`) — focus on a particular area  

In the current dataset:
- 🐟 **Green Sunfish** is the most frequently recorded species  
- 📍 **Orlando, Florida** has the highest concentration of observations in the United States

Users can add **comments** to specific documents.
Combining a required name search with filters like user, location, and date reveals the depth of observational detail in the system.

**Bells and Whistles**

An area we excelled was on the development of an easy to navigate and smooth user interface. Our focus was to create a system that is simple and user-friendly, which enhances the entire experience of every user interacting with the site.

We’re particularly proud of how we incorporated filters to improve the search functionality. This wasn’t easy to implement, but we knew it was important to make the system efficient and practical. With the user and the date filters, it is now easy to narrow down results based on who made the observation and within a specific date range.

The interactive map is really the feature that distinguishes our project. Users can select a country, zoom in to a specific city and even set a radius to receive the data only from a selected geographical area. It turns searching through data into a more visual and engaging experience.

Overall, our project demonstrates not only technical abilities but also collaboration, careful design and consideration of user requirements. 
