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

function saveQuotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
    // Send the updated quotes to the server
    fetchQuotesFromServer();
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

function fetchQuotesFromServer() {
    fetch(SERVER_URL)
        .then(response => response.json())
        .then(serverQuotes => {
            // Merge server quotes with local quotes, prioritizing server data
            const mergedQuotes = serverQuotes.map(serverQuote => {
                const localQuote = quotes.find(quote => quote.id === serverQuote.id);
                return localQuote ? { ...localQuote, ...serverQuote } : serverQuote;
            });

            quotes = mergedQuotes;
            saveQuotes();
            showRandomQuote();
        })
        .catch(error => {
            console.error('Error fetching data from server:', error);
        });
}

// Periodically sync with the server (adjust interval as needed)
setInterval(syncWithServer, 5000);

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