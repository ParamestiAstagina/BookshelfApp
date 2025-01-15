const books = [];
const RENDER_EVENT = "render-book";

function generateIdBook() {
  return new Date().getTime();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year: parseInt(year),
    isComplete,
  };
}

function makeBook(bookObject) {
  const { id, title, author, year, isComplete } = bookObject;

  const bookTitle = document.createElement("h2");
  bookTitle.innerText = title;
  bookTitle.setAttribute("data-testid", "bookItemTitle");

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = `Penulis: ${author}`;
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");

  const bookYear = document.createElement("p");
  bookYear.innerText = `Tahun: ${year}`;
  bookYear.setAttribute("data-testid", "bookItemYear");

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.setAttribute("data-bookid", id);
  container.setAttribute("data-testid", "bookItem");
  container.append(bookTitle, bookAuthor, bookYear);

  const buttonContainer = document.createElement("div");

  if (!isComplete) {
    const bookItemIsCompleteButton = document.createElement("button");
    bookItemIsCompleteButton.innerText = "Selesai dibaca";
    bookItemIsCompleteButton.classList.add("complete-button");
    bookItemIsCompleteButton.setAttribute(
      "data-testid",
      "bookItemIsCompleteButton"
    );
    bookItemIsCompleteButton.addEventListener("click", function () {
      undoCompleteBookList(id);
    });

    const bookItemDeleteButton = document.createElement("button");
    bookItemDeleteButton.innerText = "Hapus Buku";
    bookItemDeleteButton.classList.add("delete-button");
    bookItemDeleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    bookItemDeleteButton.addEventListener("click", function () {
      removeBookFromCompleteBookList(id);
    });

    const bookItemEditButton = document.createElement("button");
    bookItemEditButton.innerText = "Edit Buku";
    bookItemEditButton.classList.add("edit-button");
    bookItemEditButton.setAttribute("data-testid", "bookItemEditButton");
    bookItemEditButton.addEventListener("click", function () {
      editCompleteBookList(id);
    });

    container.append(
      bookItemIsCompleteButton,
      bookItemDeleteButton,
      bookItemEditButton
    );
  } else {
    const bookItemIsCompleteButton = document.createElement("button");
    bookItemIsCompleteButton.innerText = "Belum Selesai dibaca";
    bookItemIsCompleteButton.classList.add("incomplete-button");
    bookItemIsCompleteButton.setAttribute(
      "data-testid",
      "bookItemIsCompleteButton"
    );
    bookItemIsCompleteButton.addEventListener("click", function () {
      undoCompleteBookList(id);
    });

    const bookItemDeleteButton = document.createElement("button");
    bookItemDeleteButton.innerText = "Hapus Buku";
    bookItemDeleteButton.classList.add("delete-button");
    bookItemDeleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    bookItemDeleteButton.addEventListener("click", function () {
      removeBookFromCompleteBookList(id);
    });

    const bookItemEditButton = document.createElement("button");
    bookItemEditButton.innerText = "Edit Buku";
    bookItemEditButton.classList.add("edit-button");
    bookItemEditButton.setAttribute("data-testid", "bookItemEditButton");
    bookItemEditButton.addEventListener("click", function () {
      editCompleteBookList(id);
    });

    container.append(
      bookItemIsCompleteButton,
      bookItemDeleteButton,
      bookItemEditButton
    );
  }

  return container;
}

function addBook() {
  const bookTitle = document.getElementById("bookFormTitle").value;
  const bookAuthor = document.getElementById("bookFormAuthor").value;
  const bookYear = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const generateID = generateIdBook();
  const bookObject = generateBookObject(
    generateID,
    bookTitle,
    bookAuthor,
    bookYear,
    isComplete
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

  document.getElementById("bookFormTitle").value = "";
  document.getElementById("bookFormAuthor").value = "";
  document.getElementById("bookFormYear").value = "";
  document.getElementById("bookFormIsComplete").checked = false;

  const submitButton = document.getElementById("bookFormSubmit");
  submitButton.innerHTML =
    "Masukkan Buku ke rak <span>Belum selesai dibaca</span>";
}

function undoCompleteBookList(id) {
  const bookIndex = books.findIndex((book) => book.id === id);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function removeBookFromCompleteBookList(id) {
  const bookIndex = books.findIndex((book) => book.id === id);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function editCompleteBookList(id) {
  const bookIndex = books.findIndex((book) => book.id === id);
  if (bookIndex === -1) return;

  const bookTitle = document.getElementById("bookFormTitle");
  const bookAuthor = document.getElementById("bookFormAuthor");
  const bookYear = document.getElementById("bookFormYear");
  const bookIsComplete = document.getElementById("bookFormIsComplete");

  bookTitle.value = books[bookIndex].title;
  bookAuthor.value = books[bookIndex].author;
  bookYear.value = books[bookIndex].year;
  bookIsComplete.checked = books[bookIndex].isComplete;

  const submitButton = document.getElementById("bookFormSubmit");
  submitButton.innerHTML = "Update Buku";

  submitButton.onclick = function (event) {
    event.preventDefault();

    books[bookIndex].title = bookTitle.value;
    books[bookIndex].author = bookAuthor.value;
    books[bookIndex].year = bookYear.value;
    books[bookIndex].isComplete = bookIsComplete.checked;

    submitButton.innerHTML =
      "Masukkan Buku ke rak <span>Belum selesai dibaca</span>";
    submitButton.onclick = null;

    bookTitle.value = "";
    bookAuthor.value = "";
    bookYear.value = "";
    bookIsComplete.checked = false;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  };
}

function searchBookByTitle() {
  const searchBookTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const uncompletedBOOKList = document.getElementById("incompleteBookList");
  const completedBOOKList = document.getElementById("completeBookList");
  uncompletedBOOKList.innerHTML = "";
  completedBOOKList.innerHTML = "";

  for (const bookItem of books) {
    const bookTitleLower = bookItem.title.toLowerCase();
    if (bookTitleLower.includes(searchBookTitle)) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isComplete) {
        uncompletedBOOKList.append(bookElement);
      } else {
        completedBOOKList.append(bookElement);
      }
    }
  }
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "Bookshelf-app";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      book.year = parseInt(book.year);
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("bookForm");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBookByTitle();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document
  .getElementById("bookFormIsComplete")
  .addEventListener("change", function () {
    const submitButton = document.getElementById("bookFormSubmit");
    if (this.checked) {
      submitButton.innerHTML =
        "Masukkan Buku ke rak <span>Selesai dibaca</span>";
    } else {
      submitButton.innerHTML =
        "Masukkan Buku ke rak <span>Belum selesai dibaca</span>";
    }
  });

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById("incompleteBookList");
  const completedBOOKList = document.getElementById("completeBookList");
  uncompletedBOOKList.innerHTML = "";
  completedBOOKList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) {
      uncompletedBOOKList.append(bookElement);
    } else {
      completedBOOKList.append(bookElement);
    }
  }
});
