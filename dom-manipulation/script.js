// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const allQuotesDiv = document.getElementById("allQuotes");
const addQuoteFormContainer = document.getElementById("addQuoteFormContainer");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");

// Initialize Quotes Array from localStorage or default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "You learn more from failure than from success.", category: "Life" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Save last viewed quote to sessionStorage
function saveLastViewedQuote(quote) {
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Load last viewed quote from sessionStorage
function loadLastViewedQuote() {
  const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
  if (lastQuote) {
    quoteDisplay.innerHTML = `"${lastQuote.text}" <br> <span class="quote-category">[${lastQuote.category}]</span>`;
  }
}

// Function to display a random quote
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

// Function to display all quotes dynamically
function displayAllQuotes() {
  allQuotesDiv.innerHTML = ""; // Clear previous
  quotes.forEach((quote) => {
    const quoteCard = document.createElement("div");
    quoteCard.classList.add("quote-card");
    quoteCard.innerHTML = `
      "${quote.text}" <br> 
      <span class="quote-category">[${quote.category}]</span>
    `;
    allQuotesDiv.appendChild(quoteCard);
  });
}

// Function to create the Add Quote Form dynamically
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

  // Add event listener for the button
  addButton.addEventListener("click", addQuote);

  // Append inputs and button to formDiv
  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);

  // Append the formDiv to container in HTML
  addQuoteFormContainer.appendChild(formDiv);
}

// Function to add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text === "" || category === "") {
    alert("Please enter both quote and category!");
    return;
  }

  const newQuoteObj = { text, category };
  quotes.push(newQuoteObj);
  saveQuotes();
  displayAllQuotes();

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Export quotes to JSON file
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

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid JSON format");
      quotes.push(...importedQuotes);
      saveQuotes();
      displayAllQuotes();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Error importing quotes: " + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportToJsonFile);
importFile.addEventListener("change", importFromJsonFile);

// Initial Load
createAddQuoteForm();
displayAllQuotes();
loadLastViewedQuote(); // Load last viewed quote from sessionStorage
