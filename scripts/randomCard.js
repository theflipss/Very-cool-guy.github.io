const cardImage = document.getElementById("cardImage");
const cardName = document.getElementById("cardName");
const cardType = document.getElementById("cardType");
const cardText = document.getElementById("cardText");
const loading = document.getElementById("loading");
const randomBtn = document.getElementById("randomBtn");

async function fetchRandomCard() {
    loading.textContent = "Fetching random card...";

    try {
        const response = await fetch("https://api.scryfall.com/cards/random");
        const data = await response.json();

        // Handle double-faced cards
        let imageUrl = "";

        if (data.image_uris) {
            imageUrl = data.image_uris.normal;
        } else if (data.card_faces && data.card_faces[0].image_uris) {
            imageUrl = data.card_faces[0].image_uris.normal;
        }

        cardImage.src = imageUrl;
        cardImage.alt = data.name;

        cardName.textContent = data.name;
        cardType.textContent = data.type_line;
        cardText.textContent = data.oracle_text || "No rules text.";

        loading.textContent = "";
    } catch (error) {
        console.error(error);
        loading.textContent = "Failed to fetch card.";
    }
}

randomBtn.addEventListener("click", fetchRandomCard);

// Load one immediately
fetchRandomCard();