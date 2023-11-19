document.addEventListener('DOMContentLoaded', () => {
    const quoteList = document.getElementById('quote-list');
    const newQuoteForm = document.getElementById('new-quote-form');
  
    function fetchQuotes() {
      fetch('http://localhost:3000/quotes?_embed=likes')
        .then(response => response.json())
        .then(quotes => renderQuotes(quotes))
    }

    function renderQuotes(quotes) {
      quoteList.innerHTML = '';
      quotes.forEach(quote => {
        const li = createQuoteCard(quote);
        quoteList.appendChild(li);
      });
    }

    function createQuoteCard(quote) {
      const li = document.createElement('li');
      li.className = 'quote-card';
  
      li.innerHTML = 
        `<blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button class='btn-success' data-id="${quote.id}" data-likes="${quote.likes.length}">Likes: <span>${quote.likes.length}</span></button>
          <button class='btn-danger' data-id="${quote.id}">Delete</button>
        </blockquote> `;
  
      const likeBtn = li.querySelector('.btn-success');
      likeBtn.addEventListener('click', handleLike);
  
      const deleteBtn = li.querySelector('.btn-danger');
      deleteBtn.addEventListener('click', handleDelete);
  
      return li;
    }
  
    function handleLike(event) {
      const quoteId = event.target.getAttribute('data-id');
      fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quoteId: parseInt(quoteId) })
      })
        .then(response => response.json())
        .then(() => fetchQuotes())
        .catch(error => console.error('Error liking quote:', error));
    }

    function handleDelete(event) {
      const quoteId = event.target.getAttribute('data-id');
      fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: 'DELETE'
      })
        .then(() => fetchQuotes())
    }
  
    newQuoteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const quote = document.getElementById('new-quote').value;
      const author = document.getElementById('author').value;
  
      fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quote, author })
      })
        .then(() => {
          fetchQuotes();
          newQuoteForm.reset();
        })
    });
    fetchQuotes();
  });
  