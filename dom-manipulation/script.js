const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');

const quotes = [
    { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
    { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs'   
 },
    // ... more quotes
];

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `"${randomQuote.text}"   
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
    showRandomQuote(); // Display the newly added quote
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
  }