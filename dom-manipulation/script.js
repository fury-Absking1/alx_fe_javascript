const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const importFile = document.getElementById('importFile');

const STORAGE_KEY = 'quotes'; // Key for local storage

const quotes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; // Load from local storage or initialize empty array

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.textContent = `"${randomQuote.text}"   
 - ${randomQuote.author}`;
}

function addQuote() {
  const newQuote = {
    text: newQuoteText.value,
    category: newQuoteCategory.value
  };

  quotes.push(newQuote);
  newQuoteText.value = '';
  newQuoteCategory.value = '';

  // Directly display the newly added quote
  quoteDisplay.textContent = `"${newQuote.text}" - ${newQuote.category}`;

  saveQuotes(); // Save quotes to local storage
}

function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

function exportQuotesToJson() {
  const jsonString = JSON.stringify(quotes);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download   
 = 'quotes.json';
  link.click();

  URL.revokeObjectURL(url); // Clean up temporary URL
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Optional Session Storage Example (store last viewed quote)
const sessionLastViewedQuote = sessionStorage.getItem('lastViewedQuote');
if (sessionLastViewedQuote) {
  quoteDisplay.textContent = sessionLastViewedQuote;
}

// Attach Event Listeners
newQuoteButton.addEventListener('click', showRandomQuote);
newQuoteText.addEventListener('keyup', function(event) { // Add quote on Enter key press
  if (event.key === 'Enter') {
    addQuote();
  }
});
importFile.addEventListener('change', importFromJsonFile);

// Save quotes on page unload (optional)
window.addEventListener('beforeunload', function(event) {
  saveQuotes();
});

// Update session storage with last viewed quote on every quote change
quoteDisplay.addEventListener('DOMSubtreeModified', function() {
  sessionStorage.setItem('lastViewedQuote', quoteDisplay.textContent);
});

showRandomQuote(); // Display a random quote on page load