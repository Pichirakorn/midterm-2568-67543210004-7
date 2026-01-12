const bookService = require('../../business/services/bookService');

class BookController {

    async getAllBooks(req, res, next) {
        try {
            const { status } = req.query;
            const result = await bookService.getAllBooks(status);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    async getBookById(req, res, next) {
        try {
            const book = await bookService.getBookById(req.params.id);
            res.json(book);
        } catch (err) {
            next(err);
        }
    }

    async createBook(req, res, next) {
        try {
            const book = await bookService.createBook(req.body);
            res.status(201).json(book);
        } catch (err) {
            next(err);
        }
    }

    async updateBook(req, res, next) {
        try {
            const book = await bookService.updateBook(req.params.id, req.body);
            res.json(book);
        } catch (err) {
            next(err);
        }
    }

    async borrowBook(req, res, next) {
        try {
            const book = await bookService.borrowBook(req.params.id);
            res.json(book);
        } catch (err) {
            next(err);
        }
    }

    async returnBook(req, res, next) {
        try {
            const book = await bookService.returnBook(req.params.id);
            res.json(book);
        } catch (err) {
            next(err);
        }
    }

    async deleteBook(req, res, next) {
        try {
            const result = await bookService.deleteBook(req.params.id);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new BookController();
