const {Router, json} = require('express')
const books = require('../books.json')
const uuid = require('uuid')
const router = Router()
const path = require('path')
const fs = require('fs')
// Get all books
router.get('/get-all-books', (req,res)=>{
    try {
        const books = JSON.parse(fs.readFileSync(path.join(__dirname, '../books.json'), 'utf-8'))
        if(books)
        res.status(200).send(books)
    else res.send({message:"Not found any information"})
    } catch (error) {
        res.send(error)
    }
})
// Get book by id
router.get('/get-single-book/:id', (req, res)=>{
    try {
        const id = req.params.id
        const index = books.findIndex(book=> book.id === id.toString())
        const book = books[index]
        console.log(books)
        if(!book){
            res.send({message:'Book not found by this id'})
        }
        res.status(200).send(book)
    } catch (error) {
        res.send(error)
    }
})
//Create book
router.post('/create-book', (req,res)=>{
    try {     
          const { title, author } = req.body;
          let books = JSON.parse(fs.readFileSync(path.join(__dirname, '../books.json'), 'utf-8'));
          const newBook = {id: uuid.v4().toString(), title, author };
          const existingBook = books.find(book => book.title === title);
          if (existingBook) {
              return res.status(200).json({ message: 'Book already created by this title' });
          }
          books.push(newBook);
          fs.writeFileSync(path.join(__dirname, '../books.json'), JSON.stringify(books, null, 2));
          res.status(200).json({ book: newBook});
    } catch (error) {
        res.send(error)
    }
})
//Update book 
router.put('/update-book/:id', (req,res)=>{
    try {
        const { id } = req.params;
        const { title, author } = req.body;
        const books = JSON.parse(fs.readFileSync(path.join(__dirname,'../books.json'), 'utf-8'));
        const bookIndex = books.findIndex(book => book.id === id);
        if (bookIndex === -1) {
            return res.status(404).json({ message: 'Not found any book by this ID' });
        }
        books[bookIndex] = { ...books[bookIndex], title, author };
        fs.writeFileSync(path.join(__dirname,'../books.json'), JSON.stringify(books, null, 2));
        res.status(200).json({book: books[bookIndex]})
    } catch (error) {
        res.send(error)
    }
})
// Delete book
router.delete('/delete-book/:id', (req, res) => {
    try {
        const id  = req.params.id;
        let books = JSON.parse(fs.readFileSync(path.join(__dirname,'../books.json'), 'utf-8'));
        const updatedBooks = books.filter(book => book.id !== id);
        if (books.length === updatedBooks.length) {
            return res.status(404).json({ message: 'Not found any book by this ID' });
        }
        fs.writeFileSync(path.join(__dirname,'../books.json'), JSON.stringify(updatedBooks, null, 2));
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        res.send(error)
    }
});
module.exports = router
