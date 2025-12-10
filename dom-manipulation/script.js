// Initial Quotes Array
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "You learn more from failure than from success.", category: "Life" }
];

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const allQuotesDiv = document.getElementById("allQuotes");

// Function to display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Add one below!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" <br> <span class="quote-category">[${quote.category}]</span>`;
}

// Function to add a new quote
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both quote and category!");
    return;
  }

  const newQuoteObj = { text, category };
  quotes.push(newQuoteObj);
  
  // Update All Quotes Display
  displayAllQuotes();

  // Clear input fields
  newQuoteText.value = "";
  newQuoteCategory.value = "";
}

// Function to display all quotes dynamically
function displayAllQuotes() {
  allQuotesDiv.innerHTML = ""; // Clear previous
  quotes.forEach((quote, index) => {
    const quoteCard = document.createElement("div");
    quoteCard.classList.add("quote-card");
    quoteCard.innerHTML = `
      "${quote.text}" <br> 
      <span class="quote-category">[${quote.category}]</span>
    `;
    allQuotesDiv.appendChild(quoteCard);
  });
}

// Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// Initial Load
displayAllQuotes();
