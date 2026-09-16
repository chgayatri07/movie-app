Watchlist – Movie Application

Watchlist is a movie management and review web application developed using Node.js, Express.js, MongoDB and EJS.

The application allows users to browse movies, search for movies, view movie details, upload movie posters, and submit ratings and reviews.

Features

• View movies in a movie grid
• Search movies by name
• View individual movie details
• Upload movie posters
• Add new movies
• Edit movie details
• Replace movie posters while editing
• Delete movies
• Rate and review movies
• Display the number of reviews for each movie
• Store movies and reviews in MongoDB
• Admin page to view reviews for selected movies
• Client-side form validation

Technologies Used

• Node.js
• Express.js
• MongoDB
• EJS
• HTML
• CSS
• JavaScript
• jQuery
• jQuery Validation
• Multer

Project Structure

movie-app/

```
config/
    config.example.js

uploads/
    movie poster images

views/
    index.ejs
    moviepage.ejs
    moviedetails.ejs
    addmoviepage.ejs
    editmovie.ejs
    adminreviews.ejs

index.js
package.json
package-lock.json
.gitignore
```

The config folder contains the configuration file, while the uploads folder stores movie poster images. The views folder contains all the EJS pages used in the application. The index.js file contains the main application code, and package.json contains the project dependencies and scripts.
