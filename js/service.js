function init() {
  let mangeBooks = new MangeBook();

  getFiltersByUrl();

  gSorted = localStorage.getItem("sortBy");

  if (mangeBooks.getAllBooks().length === 0) {
    printEmptyBooksMsg();
    closeBookMangeContainer();
  } else {
    gId = getLastBookId();
    mangeBooks.sortAllBooks(gSorted);
  }
}

function deleteBook(bookId) {
  let mangeBooks = new MangeBook();
  let bookIndex = getBookIdx(bookId, mangeBooks.getAllBooks());
  let bookName = mangeBooks.getAllBooks()[bookIndex].name;
  Swal.fire({
    title: `Are you sure you want to delete the book: ${bookName}`,
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: 'Yes delete!',
    confirmButtonColor: "#fe733e",
    confirmButtonBorder: "#fe733e",
    denyButtonText: `Don't delete`,
    denyButtonColor: "#9d9c9c"
  }).then((result) => {
    if (result.isConfirmed) {
      mangeBooks.deleteBookByIndex(bookIndex);
      if (mangeBooks.getAllBooks().length === 0) {
        printEmptyBooksMsg();
        closeBookMangeContainer();
      }
      deleteBookFromScreen(bookId);

      showBookMsgSwal("deleted", bookName);
    } else if (result.isDenied) {
      Swal.fire(`The book: ${bookName} is not deleted`, '', 'info')
    }
  })




}

function sortBooks(sortBy, elBtn) {
  localStorage.setItem("sortBy", sortBy);

  let mangeBooks = new MangeBook();

  let books = mangeBooks.getAllBooks();

  changeSelectedBtn(elBtn);

  switch (sortBy) {
    case "FromNew":
      gSorted = "FromNew";
      books.sort((a, b) => {
        if (a.timeCreated > b.timeCreated) {
          return -1;
        } else {
          return 1;
        }
      });

      break;

    case "FromOld":
      gSorted = "FromOld";
      books.sort((a, b) => {
        if (a.timeCreated > b.timeCreated) {
          return 1;
        } else {
          return -1;
        }
      });

      break;

    case "FromCheap":
      gSorted = "FromCheap";
      books.sort((a, b) => {
        return a.price - b.price;
      });

      break;

    case "FromExpensive":
      gSorted = "FromExpensive";
      books.sort((a, b) => {
        return (a.price - b.price) * -1;
      });

      break;

    case "FromName":
      gSorted = "FromName";
      books.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        } else {
          return -1;
        }
      });
  }

  setFilterOnUrl();
  removeAllBooksFromScreen(books);
  books.forEach((book) => {
    if (
      checkSearch(book.name.toLowerCase(), gSearch.toLowerCase()) &&
      parseInt(book.price) >= parseInt(gMinPrice)
    ) {

      renderScreen(book);
    }
  });
}

function filterBooks() {
  let mangeBooks = new MangeBook();

  let books = mangeBooks.getAllBooks();
}

function setFilterBooks(minPrice) {
  let mangeBooks = new MangeBook();

  let books = mangeBooks.getAllBooks();

  let booksAfterFilter = books.filter((book) => {
    return book.bookPrice >= minPrice;
  });

  if (booksAfterFilter.length !== document.querySelectorAll(".bookCard")) {
    sortBooks(
      document.querySelector(".selected").classList[1],
      document.querySelector(".selected")
    );
  }
}

function onSetFilterLbl(minPrice) {
  let elRangeNumberLbl = document.querySelector(".rangeNumberLbl");
  elRangeNumberLbl.innerText = `${minPrice}$`;
  gMinPrice = parseInt(minPrice);
}

function onSearch(elSearch) {
  gSearch = elSearch;

  sortBooks(
    document.querySelector(".selected").classList[1],
    document.querySelector(".selected")
  );
}

function setFilterOnUrl() {
  let querySelector = `?sortBy=${gSorted}&search=${gSearch}&minPrice=${gMinPrice}`;

  let newUrl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    querySelector;

  window.history.pushState({ path: newUrl }, "", newUrl);
}

function getFiltersByUrl() {
  let queryStringWithParams = new URLSearchParams(window.location.search);

  gSorted = queryStringWithParams.get("sortBy") || "FromOld";
  gSearch = queryStringWithParams.get("search") || "";
  gMinPrice = queryStringWithParams.get("minPrice") || "0";

  document.querySelector(".searchBar").value = gSearch;
  document.querySelector(".minRange").value = gMinPrice;
  document.querySelector(".rangeNumberLbl").innerText = `${gMinPrice}$`;

  localStorage.setItem("sortBy", gSorted);
}
