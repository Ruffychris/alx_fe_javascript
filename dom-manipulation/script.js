// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const allQuotesDiv = document.getElementById("allQuotes");
const addQuoteFormContainer = document.getElementById("addQuoteFormContainer");

// Initial Quotes Array
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "You learn more from failure than from success.", category: "Life" }
];

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
  displayAllQuotes();

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);

// Initial Load
createAddQuoteForm(); // Dynamically create the form
displayAllQuotes();
