const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
// Filter the users array for a matching username and password
let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if at least one match is found
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    // Generate JWT Access Token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store token in session
    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review; // Retrieve review from request query
    const username = req.session.authorization?.username; // Get username from session
  
    if (!review) {
      return res.status(400).json({ message: "Review content is missing" });
    }
  
    // 1. Check if the book exists in the database
    if (books[isbn]) {
      let book = books[isbn];
      
      // 2. Add or modify the review
      // If the user already has a review for this ISBN, it will be overwritten.
      // If it's a new user, a new key-value pair is added to the reviews object.
      book.reviews[username] = review;
  
      return res.status(200).json({ message: `Review for ISBN ${isbn} has been added/updated.` });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Retrieve ISBN from the URL parameters[cite: 2]
    const username = req.session.authorization?.username; // Get username from the session[cite: 2]
  
    if (!username) {
      return res.status(403).json({ message: "User not logged in" });
    }
  
    // 1. Check if the book exists in the database
    if (books[isbn]) {
      let book = books[isbn];
      
      // 2. Check if the user has a review for this book
      if (book.reviews[username]) {
        // Delete the user's review using the 'delete' operator
        delete book.reviews[username];
        return res.status(200).json({ message: `Review for ISBN ${isbn} deleted successfully.` });
      } else {
        return res.status(404).json({ message: "No review found for this user on this book." });
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
