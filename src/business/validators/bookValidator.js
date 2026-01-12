// src/business/validators/bookValidator.js
class BookValidator {

    validateBookData(data) {
    if (!data.title || !data.author || !data.isbn) {
      throw new Error('Title, author, and ISBN are required');
    }
  }

    validateISBN(isbn) {
        const cleanISBN = isbn.replace(/-/g, '');
        const isbnPattern = /^(97[89])?\d{9}[\dXx]$/;

        if (!isbnPattern.test(cleanISBN)) {
            throw new Error('Invalid ISBN format');
        }
        return true;
    }

    validateId(id) {
        const numId = parseInt(id);
        if (isNaN(numId) || numId <= 0) {
            throw new Error('Invalid book ID');
        }
        return numId;
    }
}

module.exports = new BookValidator();
