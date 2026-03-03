// ====== NAVBAR LOGIN LOGIC ======
if(localStorage.getItem("loggedUser")){
  document.getElementById("authLinks")?.style.setProperty("display","none");
  document.getElementById("logoutBtn")?.style.setProperty("display","block");
}

document.getElementById("logoutBtn")?.addEventListener("click",()=>{
  localStorage.removeItem("loggedUser");
  window.location.href="login.html";
});


// ====== SIGNUP ======
document.getElementById("signupForm")?.addEventListener("submit",function(e){
  e.preventDefault();

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let confirm = document.getElementById("confirm").value;

  if(password !== confirm){
    alert("Passwords do not match!");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push({name,email,password});
  localStorage.setItem("users",JSON.stringify(users));

  alert("Signup Successful!");
  window.location.href="login.html";
});


// ====== LOGIN ======
document.getElementById("loginForm")?.addEventListener("submit",function(e){
  e.preventDefault();

  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let valid = users.find(u=>u.email===email && u.password===password);

  if(valid){
    localStorage.setItem("loggedUser",JSON.stringify(valid));
    alert("Login Successful");
    window.location.href="index.html";
  }else{
    alert("Invalid Credentials");
  }
});


// ====== DEFAULT BOOKS ======
if(!localStorage.getItem("books")){
  let defaultBooks = [
    {id:1,title:"The Alchemist",author:"Paulo Coelho",status:"Available"},
    {id:2,title:"Wings of Fire",author:"A.P.J Abdul Kalam",status:"Available"},
    {id:3,title:"Atomic Habits",author:"James Clear",status:"Available"}
  ];
  localStorage.setItem("books",JSON.stringify(defaultBooks));
}


// ====== DISPLAY BOOKS ======
function loadBooks(){
  let books = JSON.parse(localStorage.getItem("books")) || [];
  let bookList = document.getElementById("bookList");
  if(!bookList) return;

  bookList.innerHTML="";

  books.forEach(book=>{
    bookList.innerHTML += `
      <div class="book-card">
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p>Status: ${book.status}</p>
        ${book.status==="Available"
          ? `<button onclick="issueBook(${book.id})">Issue</button>`
          : ""}
      </div>
    `;
  });
}
loadBooks();


// ====== ISSUE BOOK ======
function issueBook(id){
  let books = JSON.parse(localStorage.getItem("books"));
  let issued = JSON.parse(localStorage.getItem("issued")) || [];

  let book = books.find(b=>b.id===id);
  book.status="Issued";

  issued.push({...book, date:new Date().toLocaleDateString()});

  localStorage.setItem("books",JSON.stringify(books));
  localStorage.setItem("issued",JSON.stringify(issued));

  loadBooks();
}


// ====== ISSUED BOOKS PAGE ======
function loadIssued(){
  let issued = JSON.parse(localStorage.getItem("issued")) || [];
  let issuedList = document.getElementById("issuedList");
  if(!issuedList) return;

  issuedList.innerHTML="";

  if(issued.length===0){
    issuedList.innerHTML="<p>No books issued</p>";
    return;
  }

  issued.forEach(book=>{
    issuedList.innerHTML += `
      <div class="book-card">
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p>Issued On: ${book.date}</p>
        <button onclick="returnBook(${book.id})">Return</button>
      </div>
    `;
  });
}
loadIssued();


// ====== RETURN BOOK ======
function returnBook(id){
  let books = JSON.parse(localStorage.getItem("books"));
  let issued = JSON.parse(localStorage.getItem("issued"));

  let book = books.find(b=>b.id===id);
  book.status="Available";

  issued = issued.filter(b=>b.id!==id);

  localStorage.setItem("books",JSON.stringify(books));
  localStorage.setItem("issued",JSON.stringify(issued));

  loadBooks();
  loadIssued();
}


// ====== SEARCH ======
function searchBooks(){
  let input = document.getElementById("search").value.toLowerCase();
  let books = JSON.parse(localStorage.getItem("books"));

  let filtered = books.filter(b =>
    b.title.toLowerCase().includes(input) ||
    b.author.toLowerCase().includes(input)
  );

  let bookList = document.getElementById("bookList");
  bookList.innerHTML="";

  filtered.forEach(book=>{
    bookList.innerHTML += `
      <div class="book-card">
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p>Status: ${book.status}</p>
      </div>
    `;
  });
}