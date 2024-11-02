const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const importFile = document.getElementById('importFile');

const STORAGE_KEY = 'quotes';
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

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

    // Send the updated quotes to the server (optional)
    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
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

function exportQuotesToJson() {
    const jsonString = JSON.stringify(quotes);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download   
 = 'quotes.json';
    link.click();

    URL.revokeObjectURL(url);
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

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const serverQuotes = await response.json();

        // Merge server quotes with local quotes, prioritizing server data
        const mergedQuotes = serverQuotes.map(serverQuote => {
            const localQuote = quotes.find(quote => quote.id === serverQuote.id);
            return localQuote ? { ...localQuote, ...serverQuote } : serverQuote;
        });

        quotes = mergedQuotes;
        saveQuotes();
        showRandomQuote();
    } catch (error) {
        console.error('Error fetching data from server:', error);
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