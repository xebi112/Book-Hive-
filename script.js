/* Slideshow code remains commented as per your input */

const APIKEY = CONFIG.APIKEY;
const BaseUrl = "https://www.googleapis.com/books/v1/volumes";
let overlay = document.querySelector(".overla");
// --- CATEGORY FETCHING ---
async function fetchBook(category, bookshelfId) {
  const shelf = document.getElementById(bookshelfId);
  if (!shelf) return;

  try {
    const response = await fetch(
      `${BaseUrl}?q=subject:${encodeURIComponent(category)}&key=${APIKEY}`,
    );

    if (!response.ok) throw new Error("Fetch failed");
    const data = await response.json();

    if (!data.items) return;

    const grid = document.createElement("div");
    grid.classList.add("book-grid");

    data.items.forEach((s) => {
      const info = s.volumeInfo;
      const bookdisplay = document.createElement("div");
      bookdisplay.classList.add("book-card");

      const thumb = info.imageLinks
        ? info.imageLinks.thumbnail.replace("http://", "https://")
        : "https://via.placeholder.com/150x200?text=No+Cover";

      bookdisplay.innerHTML = `
      
<div class="fav-book">
        <i class="fa-solid fa-star"></i>
      </div>
        <img src="${thumb}" alt="book cover"/>
        <p>${info.title}</p>
      `;
      bookdisplay.addEventListener("click", () => {
        window.location.href = `Preview.html?id=${s.id}`;
      });
      grid.appendChild(bookdisplay);

      //STAR TOGGLE
      const favBtn = bookdisplay.querySelector(".fa-star");

      // Replace your existing star event listener with this:
      favBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Stops the card from opening Preview.html

        // Toggle color
        favBtn.style.color = favBtn.style.color === "gold" ? "white" : "gold";

        // Prepare book data
        const bookData = {
          id: s.id,
          title: info.title,
          img: thumb, // This is the 'thumb' variable from your code
        };

        // Save to LocalStorage (The "Under the Hood" transfer)

        let favorites = JSON.parse(localStorage.getItem("myHiveFavs")) || []; //READ ITEMS

        // Add to list
        favorites.push(bookData);

        localStorage.setItem("myHiveFavs", JSON.stringify(favorites)); // SAVE ITEMS

        if (favBtn) {
          overlay.style.display = "flex";
        } else {
          overlay.style.display = "none";
        }
        setTimeout(() => {
          overlay.style.display = "none";
        }, 3000);
      });
    });

    shelf.appendChild(grid);
  } catch (error) {
    console.error("Error loading " + category, error);
  }
}

// --- SEARCH FUNCTION ---
async function searchBook(query) {
  const search = document.getElementById("search-results");
  const bookcontainer = document.getElementById("book-container");

  // If query is too short, reset UI and STOP (return)
  if (query.length < 3) {
    search.innerHTML = "";
    bookcontainer.style.display = "flex";
    search.style.display = "none";
    return; // This prevents the API from being called!
  }

  try {
    const res = await fetch(
      `${BaseUrl}?q=${encodeURIComponent(query)}&key=${APIKEY}`,
    );
    const data = await res.json();

    if (data && data.items) {
      search.innerHTML = "";
      bookcontainer.style.display = "none";
      search.style.display = "flex";

      const grid = document.createElement("div");
      grid.classList.add("book-grid");

      data.items.forEach((s) => {
        let volumeInfo = s.volumeInfo;
        const thumb = volumeInfo.imageLinks
          ? volumeInfo.imageLinks.thumbnail.replace("http://", "https://")
          : "https://via.placeholder.com/150x200?text=No+Cover";

        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");
        bookCard.innerHTML = ` 
          <img src="${thumb}" alt="book cover"/>
          <p>${volumeInfo.title}</p>
        `;

        grid.appendChild(bookCard);
      });
      search.appendChild(grid);
    } else {
      search.innerHTML = "<p>No particular books found for that search.</p>";
    }
  } catch (err) {
    console.error("Search error:", err);
  }
}

// --- DEBOUNCED SEARCH LISTENER ---
let typingTimer; // The "Timer" variable sits outside
const doneTypingInterval = 500; // Wait 0.5 seconds of silence

const searchInput = document.querySelector(".search-box");

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    // 1. Clear the timer from the LAST letter typed
    clearTimeout(typingTimer);

    // 2. Start a new timer for THIS letter
    typingTimer = setTimeout(() => {
      // 3. Only now do we call the function
      searchBook(e.target.value);
    }, doneTypingInterval);
  });
}

// Start loading categories
fetchBook("fiction", "fiction-container");
fetchBook("history", "history-container");
fetchBook("science", "science-container");
fetchBook("horror", "horror-container");
fetchBook("Computers", "computers-container");
fetchBook("business", "BE-container");
fetchBook("biography", "BA-container");
