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

function toogleMenu(elContainer) {
  elContainer.classList.toggle("close");
  elContainer.classList.toggle("open");
}

function getBookIdx(bookId, books) {
  for (let i = 0; i < books.length; ++i) {
    let currentBook = books[i];
    if (bookId === currentBook.id) {
      return i;
    }
  }
}

function getSelectorfromBookId(bookId) {
  return `.book-${bookId}`;
}

function emptyNewBookMenu() {
  let elBookName = document.querySelector(".bookName");
  let elDescriptionOfBook = document.querySelector(".descriptionOfBook");
  let elBookPrice = document.querySelector(".bookPrice");

  elBookName.value = "";
  elDescriptionOfBook.value = "";
  elBookPrice.value = "";
}

function updateBookTime(book) {
  let updateTime = new Date();
  book.timeCreated = updateTime;
  book.timeCreatedTxt = getTimeAndDate(book.timeCreated);
}

function changeSelectedBtn(newBtn) {
  let elOldSelectedBtn = document.querySelector(".selected");
  elOldSelectedBtn.disabled = false;
  elOldSelectedBtn.classList.toggle("selected");

  newBtn.classList.toggle("selected");
  newBtn.disabled = true;
}

function removeAllBooksFromScreen(books) {
  books.forEach((book) => {
    deleteBookFromScreen(book.id);
  });
}

function getFromBySorted(classArr) {
  return classArr[2];
}

function getLastBookId() {
  if (JSON.parse(localStorage.getItem("saveBooks")).length > 0) {
    let books = JSON.parse(localStorage.getItem("saveBooks"));

    gId = books[books.length - 1].id;
    gId++;
  }

  return gId;
}

function emptyMsgOpen() {
  let mangeBooks = new MangeBook();

  if (document.querySelector(".emptyBookMsg")) {
    return true;
  } else {
    return false;
  }
}

function firstLetterToUpperCase(bookName) {
  if (bookName.length === 1) {
    return bookName[0].toUpperCase();
  } else {
    return bookName[0].toUpperCase() + bookName.substring(1);
  }
}

function findEmptyFields(elContainer) {
  let fields = document.querySelectorAll(
    `.${elContainer} textarea, .${elContainer} input`
  );

  var fieldsArr = Array.prototype.slice.call(fields);
  emptyFields = fieldsArr.filter((field) => {
    if (field.value === "") {
      return field;
    } else {
      removeRequired(field);
    }
  });
  return emptyFields;
}

function showRequired(field) {
  field.classList.add("required");
}

function removeRequired(field) {
  field.classList.remove("required");
}

function markEmptyFields(arrFields) {
  arrFields.forEach((field) => {
    showRequired(field);
  });
}

function checkSearch(str1, str2) {
  if (str1 === "" || str2 === "") {
    return true;
  } else {
    return str1.includes(str2);
  }
}

function checkForDuplicateBook(books, bookName) {
  for (let i = 0; i < books.length; ++i) {
    let book = books[i];
    if (book.name === bookName) {
      return true;
    }
  }

  return false;
}
