let gBooks = [];
let gId = 101;
let gCurrentBookId = "";
let gCurrentUpdate = {};
let gMinCoast = 0;
let gSorted = "FromOld";

function getBooksFromLocalStorage() {
  // renderByUrl();
  if (localStorage.getItem("Books")) {
    gBooks = getBooks();
    getLastBookId();
    sortBooks(`${gSorted}`, document.querySelector(`.selected`));
  } else {
    closeBookMangeContainer();
    printEmptyBooksMsg();
  }
}

function printEmptyBooksMsg() {
  let elMain = document.querySelector(".main");
  let msg = `There are no books to display. Click + to add a new book`;
  let elP = document.createElement("p");
  elP.setAttribute("class", "emptyBookMsg");
  elP.innerText = msg;
  elMain.appendChild(elP);
}

function removeElement(element) {
  element.remove();
}

function showBookMsg(msg, bookName) {
  let elMsg = document.querySelector(".bookMsg");
  let elP = document.createElement("p");
  elP.innerText = `book ${bookName} ${msg}`;
  elMsg.appendChild(elP);
  elMsg.classList.remove("close");
  elMsg.classList.add("open");
  setTimeout(() => {
    closeBookMsg();
    elMsg.removeChild(elP);
  }, 3000);
}

function closeBookMsg() {
  let elMsg = document.querySelector(".bookMsg");
  elMsg.classList.remove("open");
  elMsg.classList.add("close");
}

function closeBookMangeContainer() {
  let elMange = document.querySelector(".mangeBooksToDisplay");

  elMange.style.display = "none";
}

function showMangeContainer() {
  let elSort = document.querySelector(".mangeBooksToDisplay");

  elSort.style.display = "flex";
}

function getLastBookId() {
  if (gBooks.length > 0) {
    gId = gBooks[gBooks.length - 1].id;
    gId++;
  }
}

function addNewBook() {
  let elBookName = document.querySelector(".bookName");
  let elDescriptionOfBook = document.querySelector(".descriptionOfBook");
  let elBookCoast = document.querySelector(".bookCoast");
  let timeCreated = new Date();
  let timeBookCreatedTxt = getTimeAndDate(timeCreated);

  addBookToList(
    elBookName.value,
    elDescriptionOfBook.value,
    elBookCoast.value,
    timeCreated,
    timeBookCreatedTxt
  );
  emptyNewBookMenu();
  closeAddContainer();
}

function getTimeAndDate(currentdate) {
  let datetime =
    "Last Update: " +
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    "-" +
    pad(currentdate.getHours()) +
    ":" +
    pad(currentdate.getMinutes()) +
    ":" +
    pad(currentdate.getSeconds());

  return datetime;
}

function pad(time) {
  if (time < 10) {
    return `0${time}`;
  }
  return time;
}

function changeURLByFilterAndSort() {
  if (gSorted !== `null` && gMinCoast !== NaN) {
    let queryStringWithParams = `?sort=${gSorted}&minCoast=${gMinCoast}`;
    let newUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      queryStringWithParams;
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
}

function renderByUrl() {
  let queryStringParams = new URLSearchParams(window.location.search);

  if (
    queryStringParams.get("sort") !== `null` &&
    queryStringParams.get("minCoast") !== NaN
  ) {
    gSorted = queryStringParams.get("sort");
    gMinCoast = queryStringParams.get("minCoast");
  }

  onSetFilter(gMinCoast);
  // changeURLByFilterAndSort();
}

function firstLetterToUpperCase(bookName) {
  if (bookName.length === 1) {
    return bookName[0].toUpperCase();
  } else {
    return bookName[0].toUpperCase() + bookName.substring(1);
  }
}

function addBookToList(
  bookName,
  bookDescription,
  bookCoast,
  timeCreated,
  timeBookCreatedTxt
) {
  let book = {
    id: gId++,
    bookName: firstLetterToUpperCase(bookName),
    bookDescription,
    bookCoast: parseInt(bookCoast),
    timeCreated,
    timeBookCreatedTxt,
  };

  gBooks.push(book);
  showBookMsg("added", book.bookName);
  if (gBooks.length === 1) {
    showMangeContainer();
    removeElement(document.querySelector(".emptyBookMsg"));
  }
  if (book.bookCoast > gMinCoast) {
    renderScreen(book);
  }
  updateLocalStorage();
}

function renderScreen(book) {
  let elMain = document.querySelector(".main");

  let newDiv = document.createElement("div");
  newDiv.setAttribute("class", `bookCard book-${book.id}`);
  if (book.bookCoast < gMinCoast) {
    newDiv.setAttribute("hidden", true);
  }

  let bookTitle = document.createElement("h2");
  bookTitle.setAttribute("class", `name-${book.id}`);
  bookTitle.innerText = `${book.bookName}`;

  let bookDescription = document.createElement("p");
  bookDescription.setAttribute("class", `description-${book.id}`);
  bookDescription.innerText = `${book.bookDescription}`;

  let bookCoast = document.createElement("p");
  bookCoast.setAttribute("class", `coast-${book.id}`);
  bookCoast.innerText = `${book.bookCoast}$`;

  let bookUpdateBtn = document.createElement("button");
  bookUpdateBtn.setAttribute("onclick", `updateBook(${book.id})`);
  bookUpdateBtn.innerText = "Update";

  let bookDeleteBtn = document.createElement("button");
  bookDeleteBtn.setAttribute("onclick", `deleteBook(${book.id})`);
  bookDeleteBtn.innerText = "Delete";

  let bookTime = document.createElement("p");
  bookTime.setAttribute("class", `bookTime-${book.id}`);
  bookTime.innerText = `${book.timeBookCreatedTxt}`;

  newDiv.appendChild(bookTitle);
  newDiv.appendChild(bookDescription);
  newDiv.appendChild(bookCoast);
  newDiv.appendChild(bookUpdateBtn);
  newDiv.appendChild(bookDeleteBtn);
  newDiv.appendChild(bookTime);

  elMain.appendChild(newDiv);
}

function updateBook(bookId) {
  let book = getBook(bookId);
  gCurrentBookId = bookId;

  let elBookName = document.querySelector(".updateBookName");
  let elDescriptionOfBook = document.querySelector(".updateDescriptionOfBook");
  let elBookCoast = document.querySelector(".updateBookCoast");

  elBookName.value = book.bookName;
  elDescriptionOfBook.value = book.bookDescription;
  elBookCoast.value = book.bookCoast;

  let elUpdateContainer = document.querySelector(".updateContainer");
  toogleMenu(elUpdateContainer);
}

function updateCurrentBook(bookId) {
  let book = getBook(bookId);

  let elNameOld = document.querySelector(`.name-${bookId}`);
  let elDecOld = document.querySelector(`.description-${bookId}`);
  let elCoastOld = document.querySelector(`.coast-${bookId}`);
  let elBookTime = document.querySelector(`.bookTime-${book.id}`);

  let elBookNameNew = document.querySelector(".updateBookName");
  let elDescriptionOfBookNew = document.querySelector(
    ".updateDescriptionOfBook"
  );
  let elBookCoastNew = document.querySelector(".updateBookCoast");

  //update Book Time()
  updateBookTime(book);

  //Change DOM
  elNameOld.innerText = firstLetterToUpperCase(elBookNameNew.value);
  elDecOld.innerText = elDescriptionOfBookNew.value;
  elCoastOld.innerText = elBookCoastNew.value + "$";
  elBookTime.innerText = book.timeBookCreatedTxt;

  //Change Array
  book.bookName = firstLetterToUpperCase(elBookNameNew.value);
  book.bookDescription = elDescriptionOfBookNew.value;
  book.bookCoast = elBookCoastNew.value;

  let elUpdateContainer = document.querySelector(".updateContainer");
  toogleMenu(elUpdateContainer);
  showBookMsg("updated", book.bookName);
  updateLocalStorage();
  renderAllBooks(gMinCoast);
}

function updateBookTime(book) {
  let updateTime = new Date();
  book.timeCreated = updateTime;
  book.timeBookCreatedTxt = getTimeAndDate(updateTime);
}

function toogleMenu(elContainer) {
  elContainer.classList.toggle("close");
  elContainer.classList.toggle("open");
}

function getBook(bookId) {
  for (let i = 0; i < gBooks.length; ++i) {
    let book = gBooks[i];
    if (book.id === bookId) {
      return book;
    }
  }
}

function deleteBook(bookId) {
  let bookInx = getBookIdx(bookId);
  let bookName = gBooks[bookInx].bookName;
  gBooks.splice(bookInx, 1);

  deleteBookFromScreen(bookId);
  showBookMsg("deleted", bookName);
  updateLocalStorage();

  if (gBooks.length === 0) {
    disableSortBtn();
    printEmptyBooksMsg();
    closeBookMangeContainer();
  }
}

function disableSortBtn() {
  let btns = document.querySelectorAll(".sort");
  btns.forEach((btn) => {
    btn.disabled = true;
  });
}

function EnableSortBtn() {
  let btns = document.querySelectorAll(".sort");
  btns.forEach((btn) => {
    btn.disabled = false;
  });
}

function getBookIdx(bookId) {
  for (let i = 0; i < gBooks.length; ++i) {
    let book = gBooks[i];
    if (book.id === bookId) {
      return i;
    }
  }
}

function deleteBookFromScreen(bookId) {
  let getSelector = getSelectorfromBookId(bookId);
  let elBookCard = document.querySelector(getSelector);

  removeElement(elBookCard);
}

function getSelectorfromBookId(bookId) {
  return `.book-${bookId}`;
}

function emptyNewBookMenu() {
  let elBookName = document.querySelector(".bookName");
  let elDescriptionOfBook = document.querySelector(".descriptionOfBook");
  let elBookCoast = document.querySelector(".bookCoast");

  elBookName.value = "";
  elDescriptionOfBook.value = "";
  elBookCoast.value = "";
}

function openAddContainer() {
  let elAddContainer = document.querySelector(".addContainer");
  toogleMenu(elAddContainer);
}

function closeAddContainer() {
  let elAddContainer = document.querySelector(".addContainer");
  toogleMenu(elAddContainer);
}

function closeUpdateContainer() {
  let elUpdateContainer = document.querySelector(".updateContainer");
  toogleMenu(elUpdateContainer);
}

function updateLocalStorage() {
  if (gBooks.length > 0) {
    localStorage.setItem("Books", JSON.stringify(gBooks));
  } else {
    emptyBookLocalStorage();
  }
}

function renderAllBooks(minCoast) {
  gBooks = JSON.parse(localStorage.getItem("Books"));

  removeBookBeforeFilter();

  gBooks.forEach((book) => {
    renderScreen(book);
  });
}

function getBooks() {
  let books = JSON.parse(localStorage.getItem("Books"));

  return books;
}

function removeBookBeforeFilter() {
  let elBooksCard = document.querySelectorAll(".bookCard");

  elBooksCard.forEach((bookCard) => {
    bookCard.remove();
  });
}

function sortBooks(soryBy, elBtn) {
  console.log("sorted");
  changeSelectedBtn(elBtn);

  switch (soryBy) {
    case "FromNew":
      gSorted = "FromNew";
      gBooks.sort((a, b) => {
        if (a.timeCreated > b.timeCreated) {
          return -1;
        } else {
          return 1;
        }
      });

      break;

    case "FromOld":
      gSorted = "FromOld";
      gBooks.sort((a, b) => {
        if (a.timeCreated > b.timeCreated) {
          return 1;
        } else {
          return -1;
        }
      });

      break;

    case "FromCheap":
      gSorted = "FromCheap";
      gBooks.sort((a, b) => {
        return a.bookCoast - b.bookCoast;
      });

      break;

    case "FromExpensive":
      gSorted = "FromExpensive";
      gBooks.sort((a, b) => {
        return (a.bookCoast - b.bookCoast) * -1;
      });

      break;

    case "FromName":
      gSorted = "FromName";
      gBooks.sort((a, b) => {
        if (a.bookName > b.bookName) {
          return 1;
        } else {
          return -1;
        }
      });
  }

  // changeURLByFilterAndSort();
  emptyBookLocalStorage();
  updateLocalStorage();
  renderAllBooks(gMinCoast);
}

function changeSelectedBtn(newBtn) {
  let elOldSelectedBtn = document.querySelector(".selected");
  elOldSelectedBtn.disabled = false;
  elOldSelectedBtn.classList.toggle("selected");

  newBtn.classList.toggle("selected");
  newBtn.disabled = true;
}

function emptyBookLocalStorage() {
  localStorage.removeItem("Books");
}

function removeAllBooksFromScreen() {
  gBooks.forEach((book) => {
    deleteBookFromScreen(book.id);
  });
}

function onSetFilter(minCoast) {
  let elRangeNumberLbl = document.querySelector(".rangeNumberLbl");
  elRangeNumberLbl.innerText = `${minCoast}$`;

  gMinCoast = parseInt(minCoast);

  let booksAfterFilter = gBooks.filter((book) => {
    return book.bookCoast >= minCoast;
  });

  if (booksAfterFilter.length !== document.querySelectorAll(".bookCard")) {
    renderAllBooks(gMinCoast);
    // changeURLByFilterAndSort();
  }
}
