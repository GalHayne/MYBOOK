let gId = 101;
let gMinPrice = 0;
let gSorted = "FromOld";
let gSearch = "";
let gCurrentBookId;

class Book {
  id;
  name;
  price;
  description;
  timeCreated;
  timeCreatedTxt;
  constructor(id, name, price, description, timeCreated) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.timeCreated = timeCreated;
    this.timeCreatedTxt = getTimeAndDate(timeCreated);
  }
}

class Books {
  #books;
  constructor() {
    this.#books = this.getBooksFromStorage();
  }

  saveNewBook(book) {
    this.#books.push(book);
    localStorage.setItem("saveBooks", JSON.stringify(this.#books));
  }

  setBooks(books) {
    this.#books = books;
  }

  saveBooksToSrorage() {
    localStorage.setItem("saveBooks", JSON.stringify(this.#books));
  }

  getBooksFromStorage() {
    this.#books = JSON.parse(localStorage.getItem("saveBooks")) || [];
    return this.#books;
  }

  deleteCurrentBook(bookIdx) {
    this.#books.splice(bookIdx, 1);
    localStorage.setItem("saveBooks", JSON.stringify(this.#books));
  }

  updateBook(bookIdx, book) {
    this.#books[bookIdx] = book;
    localStorage.setItem("saveBooks", JSON.stringify(this.#books));
  }

  sortAllBooks(sortBy) {
    sortBooks(sortBy, document.querySelector(`.${sortBy}`));
  }

  fillterAllBooks() {
    filterBooks();
  }
}

class MangeBook {
  #books;
  constructor() {
    let newStorage = new Books();
    this.#books = newStorage.getBooksFromStorage();
  }

  addNewBook(id, name, price, description, timeCreated) {
    let newBook = new Book(id, name, price, description, timeCreated);
    let newStorage = new Books();
    newStorage.saveNewBook(newBook);
    this.#books = newStorage.getBooksFromStorage();
  }

  getAllBooks() {
    return this.#books;
  }

  getNewBook() {
    let newStorage = new Books();
    let lastBook = newStorage.getBooksFromStorage();
    return lastBook[lastBook.length - 1];
  }

  deleteBookByIndex(bookIdx) {
    let newStorage = new Books();
    newStorage.deleteCurrentBook(bookIdx);
    this.#books = newStorage.getBooksFromStorage();
  }

  getBookById(bookId) {
    for (let i = 0; i < this.#books.length; ++i) {
      let book = this.#books[i];
      if (book.id === bookId) {
        return book;
      }
    }
  }

  updateCurrentBook(bookIdx, book) {
    let newStorage = new Books();
    newStorage.updateBook(bookIdx, book);
    this.#books = newStorage.getBooksFromStorage();
  }

  sortAllBooks(sortBy) {
    let newStorage = new Books();
    newStorage.sortAllBooks(sortBy);
  }

  fillterAllBooks() {
    let newStorage = new Books();
    newStorage.fillterAllBooks();
  }
}
