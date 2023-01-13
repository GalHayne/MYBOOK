function renderScreen(book) {
  let elMain = document.querySelector(".main");

  let newDiv = document.createElement("div");
  newDiv.setAttribute("class", `bookCard book-${book.id}`);
  if (parseInt(book.price) < parseInt(gMinPrice)) {
    newDiv.setAttribute("hidden", true);
  }

  let bookTitle = document.createElement("h2");
  bookTitle.setAttribute("class", `name-${book.id}`);
  bookTitle.innerText = `${book.name}`;

  let bookDescription = document.createElement("p");
  bookDescription.setAttribute("class", `description-${book.id}`);
  bookDescription.innerText = `${book.description}`;

  let bookPrice = document.createElement("p");
  bookPrice.setAttribute("class", `Price-${book.id}`);
  bookPrice.innerText = `${book.price}$`;

  let bookUpdateBtn = document.createElement("button");
  bookUpdateBtn.setAttribute("onclick", `updateBook(${book.id})`);
  bookUpdateBtn.innerText = "Update";

  let bookDeleteBtn = document.createElement("button");
  bookDeleteBtn.setAttribute("onclick", `deleteBook(${book.id})`);
  bookDeleteBtn.innerText = "Delete";

  let bookTime = document.createElement("p");
  bookTime.setAttribute("class", `bookTime-${book.id}`);
  bookTime.innerText = `${book.timeCreatedTxt}`;

  newDiv.appendChild(bookTitle);
  newDiv.appendChild(bookDescription);
  newDiv.appendChild(bookPrice);
  newDiv.appendChild(bookUpdateBtn);
  newDiv.appendChild(bookDeleteBtn);
  newDiv.appendChild(bookTime);

  elMain.appendChild(newDiv);
}

function openAddContainer() {
  let elAddContainer = document.querySelector(".addContainer");
  toogleMenu(elAddContainer);

  let allOtherBtn = getAllOtherBtn();
  disabledAllOtherBtn(allOtherBtn);
}

function closeAddContainer() {
  let elAddContainer = document.querySelector(".addContainer");

  let arrFields = findEmptyFields("addContainer");
  arrFields.forEach((field) => {
    removeRequired(field);
  });

  toogleMenu(elAddContainer);
  let allOtherBtn = getAllOtherBtn();
  enabledAllOtherBtn(allOtherBtn);

  emptyNewBookMenu();
}

function createNewBook() {
  let arrFields = findEmptyFields("addContainer");
  markEmptyFields(arrFields);
  if (arrFields.length === 0) {
    let elName = firstLetterToUpperCase(
      document.querySelector(".bookName").value
    );
    let elDescription = document.querySelector(".descriptionOfBook").value;
    let bookPrice = document.querySelector(".bookPrice").value;

    let mangeBooks = new MangeBook();
    if (checkForDuplicateBook(mangeBooks.getAllBooks(), elName) === false) {
      mangeBooks.addNewBook(
        gId++,
        elName,
        bookPrice,
        elDescription,
        new Date()
      );
      showBookMsgSwal("added",elName);
      let sortBy = gSorted;
      mangeBooks.sortAllBooks(sortBy);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Cant be added cause have other book in this book name:${elName}`,
      })
    }

    closeAddContainer();
    emptyNewBookMenu();
    if (emptyMsgOpen()) {
      openMangeContainer();
      removeElement(document.querySelector(".DivEmptyBookMsg"));
    }
  }
}

function emptyNewBookMenu() {
  let elBookName = document.querySelector(".bookName");
  let elDescriptionOfBook = document.querySelector(".descriptionOfBook");
  let elBookPrice = document.querySelector(".bookPrice");

  elBookName.value = "";
  elDescriptionOfBook.value = "";
  elBookPrice.value = "";
}

function deleteBookFromScreen(bookId) {
  let getSelector = getSelectorfromBookId(bookId);
  let elBookCard = document.querySelector(getSelector);

  if (elBookCard !== null) {
    removeElement(elBookCard);
  }
}

function removeElement(element) {
  element.remove();
}

function updateBook(bookId) {
  let mangeBooks = new MangeBook();
  let book = mangeBooks.getBookById(bookId);
  gCurrentBookId = bookId;

  let elBookName = document.querySelector(".updateBookName");
  let elDescriptionOfBook = document.querySelector(".updateDescriptionOfBook");
  let elBookPrice = document.querySelector(".updateBookPrice");

  elBookName.value = firstLetterToUpperCase(book.name);
  elDescriptionOfBook.value = book.description;
  elBookPrice.value = book.price;

  let elUpdateContainer = document.querySelector(".updateContainer");
  toogleMenu(elUpdateContainer);
  let allOtherBtn = getAllOtherBtn();
  disabledAllOtherBtn(allOtherBtn);
}

function closeUpdateContainer() {
  let elUpdateContainer = document.querySelector(".updateContainer");

  let arrFields = findEmptyFields("updateContainer");
  arrFields.forEach((field) => {
    removeRequired(field);
  });

  toogleMenu(elUpdateContainer);
  let allOtherBtn = getAllOtherBtn();
  enabledAllOtherBtn(allOtherBtn);
}

function updateCurrentBook(bookId) {
  let arrFields = findEmptyFields("updateContainer");
  markEmptyFields(arrFields);
  if (arrFields.length === 0) {
    let mangeBooks = new MangeBook();
    let book = mangeBooks.getBookById(bookId);

    let elNameOld = document.querySelector(`.name-${bookId}`);
    let elDecOld = document.querySelector(`.description-${bookId}`);
    let elPriceOld = document.querySelector(`.Price-${bookId}`);
    let elBookTime = document.querySelector(`.bookTime-${book.id}`);

    let elBookNameNew = document.querySelector(".updateBookName");
    let elDescriptionOfBookNew = document.querySelector(
      ".updateDescriptionOfBook"
    );
    let elBookPriceNew = document.querySelector(".updateBookPrice");

    //update Book Time()
    updateBookTime(book);

    //Change DOM
    elNameOld.innerText = elBookNameNew.value;
    elDecOld.innerText = elDescriptionOfBookNew.value;
    elPriceOld.innerText = elBookPriceNew.value + "$";
    elBookTime.innerText = book.timeCreatedTxt;

    let newBook = book;
    newBook.name = firstLetterToUpperCase(elBookNameNew.value);
    newBook.description = elDescriptionOfBookNew.value;
    newBook.price = elBookPriceNew.value;

    //Update MangeBook Books
    let bookIdx = getBookIdx(bookId, mangeBooks.getAllBooks());
    mangeBooks.updateCurrentBook(bookIdx, newBook);

    closeUpdateContainer();

    let sortBy = document.querySelector(".selected").classList[1];

    mangeBooks.sortAllBooks(sortBy);

    showBookMsgSwal("updated", newBook.name);
  }
}

function getAllOtherBtn() {
  let nodeBtn = document.querySelectorAll("button");

  let arrBtn = Array.prototype.slice.call(nodeBtn);

  arrBtn = arrBtn.filter((button) => {
    if (
      button.classList[0] !== "UpdateBookBtn" &&
      button.classList[0] !== "AddNewBookBtn"
    ) {
      return button;
    }
  });

  return arrBtn;
}

function disabledAllOtherBtn(arrBtn) {
  arrBtn.forEach((btn) => {
    btn.disabled = true;
    btn.style.cursor = "default";
  });

  elSearchBook = document.querySelector(".searchBar");
  elSearchBook.disabled = true;

  elMinPrice = document.querySelector(".minRange");
  elMinPrice.disabled = true;
}

function enabledAllOtherBtn(arrBtn) {
  arrBtn.forEach((btn) => {
    btn.disabled = false;
    btn.style.cursor = "pointer";
  });

  elSearchBook = document.querySelector(".searchBar");
  elSearchBook.disabled = false;

  elMinPrice = document.querySelector(".minRange");
  elMinPrice.disabled = false;
}

function printEmptyBooksMsg() {
  let elMain = document.querySelector(".main");
  let elDiv = document.createElement("div");
  elDiv.setAttribute("class", "DivEmptyBookMsg");
  let msg = `There are no books to display. Click + to add a new book`;
  let elP = document.createElement("p");
  elP.setAttribute("class", "emptyBookMsg");
  elP.innerText = msg;
  elDiv.appendChild(elP);

  elMain.appendChild(elDiv);
}

function closeBookMangeContainer() {
  let elMange = document.querySelector(".mangeBooksToDisplay");

  elMange.style.display = "none";
}

function openMangeContainer() {
  let elSort = document.querySelector(".mangeBooksToDisplay");

  elSort.style.display = "flex";
}

// function showBookMsg(msg, bookName) {
//   let elMsg = document.querySelector(".bookMsg");
//   let elP = document.createElement("p");
//   elP.innerText = `book ${bookName} ${msg}`;
//   elMsg.appendChild(elP);
//   elMsg.classList.remove("close");
//   elMsg.classList.add("open");
//   setTimeout(() => {
//     closeBookMsg();
//     elMsg.removeChild(elP);
//   }, 3000);
// }

function showBookMsgSwal(msg,bookName){
  Swal.fire({
    position: 'bottom-start',
    icon: 'success',
    iconColor: '#fe733e',
    title: `The Book:${bookName} has been ${msg}`,
    showConfirmButton: false,
    timer: 2500
  })
}

function closeBookMsg() {
  let elMsg = document.querySelector(".bookMsg");
  elMsg.classList.remove("open");
  elMsg.classList.add("close");
}
