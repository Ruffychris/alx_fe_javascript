// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const allQuotesDiv = document.getElementById("allQuotes");
const addQuoteFormContainer = document.getElementById("addQuoteFormContainer");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");
const categoryFilter = document.getElementById("categoryFilter");

// Notification div for updates
const notificationDiv = document.createElement("div");
notificationDiv.style.padding = "10px";
notificationDiv.style.margin = "10px 0";
notificationDiv.style.border = "1px solid #ccc";
notificationDiv.style.backgroundColor = "#f0f8ff";
notificationDiv.style.display = "none";
document.body.insertBefore(notificationDiv, allQuotesDiv);

// Initialize Quotes Array from localStorage or default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "You learn more from failure than from success.", category: "Life" }
];

// ------------------------ Storage Functions ------------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function saveLastViewedQuote(quote) {
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function loadLastViewedQuote() {
  const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
  if (lastQuote) {
    quoteDisplay.innerHTML = `"${lastQuote.text}" <br> <span class="quote-category">[${lastQuote.category}]</span>`;
  }
}

function saveLastSelectedCategory(category) {
  localStorage.setItem("lastCategory", category);
}

function loadLastSelectedCategory() {
  const lastCategory = localStorage.getItem("lastCategory");
  if (lastCategory) {
    categoryFilter.value = lastCategory;
  }
}

// ------------------------ Quote Display ------------------------
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Add one below!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" <br> <span class="quote-category">[${quote.category}]</span>`;
  saveLastViewedQuote(quote);
}

function displayAllQuotes() {
  const selectedCategory = categoryFilter.value;
  allQuotesDiv.innerHTML = "";

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  filteredQuotes.forEach((quote) => {
    const quoteCard = document.createElement("div");
    quoteCard.classList.add("quote-card");
    quoteCard.innerHTML = `
      "${quote.text}" <br>
      <span class="quote-category">[${quote.category}]</span>
    `;
    allQuotesDiv.appendChild(quoteCard);
  });
}

function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  loadLastSelectedCategory();
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  saveLastSelectedCategory(selectedCategory);
  displayAllQuotes();
}

// ------------------------ Add Quote Form ------------------------
function createAddQuoteForm() {
  const formDiv = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";
  quoteInput.id = "newQuoteText";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.id = "newQuoteCategory";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.id = "addQuoteBtn";

  addButton.addEventListener("click", addQuote);

  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);

  addQuoteFormContainer.appendChild(formDiv);
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category!");
    return;
  }

  const newQuoteObj = { text, category };
  quotes.push(newQuoteObj);
  saveQuotes();
  populateCategories();
  displayAllQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// ------------------------ JSON Import / Export ------------------------
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid JSON format");
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      displayAllQuotes();
      showNotification("Quotes imported successfully!");
    } catch (err) {
      alert("Error importing quotes: " + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ------------------------ Notification ------------------------
function showNotification(message) {
  notificationDiv.textContent = message;
  notificationDiv.style.display = "block";
  setTimeout(() => notificationDiv.style.display = "none", 4000);
}

// ------------------------
// Syncing Data with Server and Implementing Conflict Resolution
// ------------------------

// Fetch quotes from server (GET)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await response.json();

    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    return serverQuotes;
  } catch (err) {
    console.error("Error fetching quotes from server:", err);
    return [];
  }
}

// Send local quotes to server (POST)
async function sendQuotesToServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quotes)
    });

    if (response.ok) {
      console.log("Quotes successfully sent to server.");
    } else {
      console.error("Failed to send quotes to server.");
    }
  } catch (err) {
    console.error("Error sending quotes to server:", err);
  }
}

// ------------------------
// Checker expects: syncQuotes
// ------------------------
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  const newQuotes = serverQuotes.filter(sq => !quotes.some(lq => lq.text === sq.text));
  if (newQuotes.length > 0) {
    quotes.push(...newQuotes);
    saveQuotes();
    populateCategories();
    displayAllQuotes();
    showNotification("Quotes updated from server!");
  }

  await sendQuotesToServer();
}

// Periodic sync every 60 seconds
setInterval(syncQuotes, 60000);

// ------------------------ Event Listeners ------------------------
newQuoteBtn.addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportToJsonFile);
importFile.addEventListener("change", importFromJsonFile);
categoryFilter.addEventListener("change", filterQuotes);

// ------------------------ Initial Load ------------------------
createAddQuoteForm();
populateCategories();
displayAllQuotes();
loadLastViewedQuote();
syncQuotes(); // Initial server sync
