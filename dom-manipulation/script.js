const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const categoryFilter = document.getElementById('categoryFilter');

const STORAGE_KEY = 'quotes';

let quotes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let lastSelectedCategory = localStorage.getItem('lastCategory') || 'all';

function showRandomQuote(categoryFilter) {
  const filteredQuotes = quotes.filter(quote => categoryFilter === 'all' || quote.category === categoryFilter);
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];   

    quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.author}`;
  } else {
    quoteDisplay.textContent = "No quotes found for this category.";
  }
}

function addQuote() {
  const newQuote = {
    text: newQuoteText.value,
    category: newQuoteCategory.value
  };

  quotes.push(newQuote);
  newQuoteText.value = '';
  newQuoteCategory.value = '';

  // Update the category filter options
  populateCategories();

  saveQuotes();
  showRandomQuote(lastSelectedCategory);
}

function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  localStorage.setItem('lastCategory', lastSelectedCategory);
}

function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
  uniqueCategories.unshift('all');

  categoryFilter.innerHTML = '';
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.text   
 = category;
    categoryFilter.appendChild(option);   

  });

  categoryFilter.value = lastSelectedCategory;
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  lastSelectedCategory = selectedCategory;
  showRandomQuote(selectedCategory);
}

// Initial setup
populateCategories();
showRandomQuote(lastSelectedCategory);

newQuoteButton.addEventListener('click', showRandomQuote);
newQuoteText.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    addQuote();
  }
});
categoryFilter.addEventListener('change', filterQuotes);