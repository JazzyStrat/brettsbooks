class Book {
  constructor(title, author, date) {
    this.title = title;
    this.author = author;
    this.date = date;
  }
}

class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><a class='expand' href='#'>${book.title}</a></td>
        <td>${book.author}</td>
        <td>${book.date}</td>
        <td><a class='deleteButton' href='#'>X</a></td>
        `;;

    list.appendChild(row);
    if (book.note) {UI.createBookNote(row, book.note)}
    else {UI.createBookNote(row)};
  }

  static createBookNote(bookRow, note='') {
    const bookNoteRow = document.createElement("tr");
    bookNoteRow.className = "note-hidden";
    bookNoteRow.innerHTML = `
    <td colspan='4'>
    <h3>Book Note</h3>
    <blockquote contenteditable='true'>${note}</blockquote>
    <input type='submit' class='noteButton' value='save note'>
    </td>
    `
    bookRow.insertAdjacentElement("afterend", bookNoteRow);
  }

  

  static toggleBookNote(event) {

    if (event.target.className == 'expand') {
    const hiddenNote = event.target.parentElement.parentElement.nextElementSibling;
      console.log(hiddenNote);
         if (hiddenNote.className == "note-hidden") {
           hiddenNote.className = "note";
         } else {
           hiddenNote.className = "note-hidden";
         }
    }

        if (event.target.className == "noteButton") {
          const hiddenNote =
            event.target.parentElement.parentElement;
          console.log(hiddenNote);
          if (hiddenNote.className == "note-hidden") {
            hiddenNote.className = "note";
          } else {
            hiddenNote.className = "note-hidden";
          }
        }
    // if (event.target.className = '')

   
  }

  static deleteBook(element) {
    element.parentElement.parentElement.nextElementSibling.remove();

    element.parentElement.parentElement.remove();


  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const body = document.querySelector("body");
    const h1 = document.querySelector("form");
    body.insertBefore(div, h1);
    setTimeout(() => div.remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#date").value = "";
  }
}

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") == null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    let books = Store.getBooks();
    books.push(book); 
    localStorage.setItem("books", JSON.stringify(books));
  } 

  static removeBook(bookTitle) {
    let CurrentShelf = Store.getBooks();
    let UpdatedShelf = CurrentShelf.filter((book) => book.title !== bookTitle);
    localStorage.setItem("books", JSON.stringify(UpdatedShelf));
  }

  static addNote(e) {
  let note = e.target.previousElementSibling.textContent;

  let bookRow = e.target.parentElement.parentElement.previousElementSibling;
  let bookTitle = bookRow.firstElementChild.firstElementChild.textContent;
  let books = Store.getBooks();

  for(let i = 0; i < books.length; i++) {
    if (books[i].title = bookTitle) {
      books[i].note = note;
      break;
    }
  }
    localStorage.setItem("books", JSON.stringify(books));
  // books.forEach((book) => {
  //   if book.title - 
  // })
  }

} 

// popular UI with books from localStorage
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//book form listener
document.querySelector("#book-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const date = document.querySelector("#date").value;

  if (title == "" || author == "" || date == "") {
    UI.showAlert("Plz fill all fields", "whoops");
  } else {
    const book = new Book(title, author, date);
    UI.addBookToList(book);
    UI.clearFields();
    UI.showAlert("Book Added ✅", "success");

    Store.addBook(book);
  }
});

//delete book listener
bookListTable = document.querySelector("#book-list");
bookListTable.addEventListener('click', (event) => {
  if (event.target.className == 'deleteButton') {
    UI.deleteBook(event.target);
    Store.removeBook(
      event.target.parentElement.parentElement.firstElementChild.textContent);
  }

});

bookListTable.addEventListener('click', (event) => {
  if (event.target.className == 'expand') {
    UI.toggleBookNote(event);
  }
});

bookListTable.addEventListener("mouseover", (event) => {
  if (event.target.className == "expand") {
    UI.toggleBookNote(event);
   }


});

bookListTable.addEventListener('click', (e) => {
  if(e.target.className == 'noteButton') {
    Store.addNote(e);
    UI.showAlert("note saved!", "success"); 
    UI.toggleBookNote(e);



   }
});

