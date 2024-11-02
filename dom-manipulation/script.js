const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const importFile = document.getElementById('importFile');

const STORAGE_KEY = 'quotes';
const SERVER_URL = 'https://your-server-endpoint'; // Replace with your actual server URL

let quotes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

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

    saveQuotes();
    showRandomQuote();
}

async function saveQuotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));

    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quotes)
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        console.log('Quotes saved to server successfully');
    } catch (error) {
        console.error('Error saving quotes to server:', error);
    }
}

// Periodically sync with the server (adjust interval as needed)
setInterval(fetchQuotesFromServer, 5000);

// Initial setup
populateCategories();
showRandomQuote();

newQuoteButton.addEventListener('click', showRandomQuote);
newQuoteText.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        addQuote();
    }
});
categoryFilter.addEventListener('change', filterQuotes);