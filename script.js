// ==========================================
// FOODRESCUE - JAVASCRIPT
// ==========================================

let donations = [];

// Load saved donations
try {
    donations =
        JSON.parse(localStorage.getItem("foodRescueDonations")) || [];
} catch (error) {
    donations = [];
}


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const donationForm =
    document.getElementById("donationForm");

const foodList =
    document.getElementById("foodList");

const searchInput =
    document.getElementById("searchInput");


// ==========================================
// SAVE DATA
// ==========================================

function saveDonations() {

    localStorage.setItem(
        "foodRescueDonations",
        JSON.stringify(donations)
    );

}


// ==========================================
// ADD FOOD DONATION
// ==========================================

function addDonation(event) {

    event.preventDefault();

    const providerName =
        document.getElementById("providerName").value.trim();

    const foodName =
        document.getElementById("foodName").value.trim();

    const quantity =
        Number(document.getElementById("quantity").value);

    const servings =
        Number(document.getElementById("servings").value);

    const foodType =
        document.getElementById("foodType").value;

    const availableUntil =
        document.getElementById("availableUntil").value;

    const location =
        document.getElementById("location").value.trim();

    const contact =
        document.getElementById("contact").value.trim();

    const preparedTime =
        document.getElementById("preparedTime").value;


    // Create donation object

    const donation = {

        id: Date.now(),

        providerName: providerName,

        foodName: foodName,

        quantity: quantity,

        servings: servings,

        foodType: foodType,

        availableUntil: availableUntil,

        location: location,

        contact: contact,

        preparedTime: preparedTime,

        status: "Available"

    };


    // Add to array

    donations.push(donation);


    // Save

    saveDonations();


    // Clear form

    donationForm.reset();


    // Update website

    renderDonations();

    updateDashboard();


    alert(
        "Food donation posted successfully! 🍱"
    );

}


// ==========================================
// DISPLAY FOOD DONATIONS
// ==========================================

function renderDonations() {

    if (!foodList) {
        return;
    }


    const searchText =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    foodList.innerHTML = "";


    const filteredDonations =
        donations.filter(donation => {

            const food =
                donation.foodName.toLowerCase();

            const location =
                donation.location.toLowerCase();

            return (
                food.includes(searchText) ||
                location.includes(searchText)
            );

        });


    // No donations

    if (filteredDonations.length === 0) {

        foodList.innerHTML = `
            <div class="empty-message">
                No food donations available.
            </div>
        `;

        return;
    }


    // Create cards

    filteredDonations.forEach(donation => {

        const card =
            document.createElement("div");

        card.className = "food-card";


        card.innerHTML = `

            <h3>🍱 ${donation.foodName}</h3>

            <p>
                <strong>Provider:</strong>
                ${donation.providerName}
            </p>

            <p>
                <strong>Quantity:</strong>
                ${donation.quantity} kg
            </p>

            <p>
                <strong>Servings:</strong>
                ${donation.servings}
            </p>

            <p>
                <strong>Food Type:</strong>
                ${donation.foodType}
            </p>

            <p>
                <strong>📍 Location:</strong>
                ${donation.location}
            </p>

            <p>
                <strong>⏰ Available Until:</strong>
                ${donation.availableUntil}
            </p>

            <p>
                <strong>📞 Contact:</strong>
                ${donation.contact}
            </p>

            <span class="food-status">
                ${donation.status}
            </span>

            ${
                donation.status === "Available"
                ?
                `
                <button
                    class="collect-btn"
                    onclick="collectDonation(${donation.id})"
                >
                    🤝 Accept & Collect
                </button>
                `
                :
                ""
            }

        `;


        foodList.appendChild(card);

    });

}


// ==========================================
// ACCEPT / COLLECT FOOD
// ==========================================

function collectDonation(id) {

    const donation =
        donations.find(
            item => item.id === id
        );


    if (!donation) {
        return;
    }


    const confirmation =
        confirm(
            "Do you want to accept this food donation?"
        );


    if (!confirmation) {
        return;
    }


    donation.status =
        "Collected";


    saveDonations();


    renderDonations();

    updateDashboard();


    alert(
        "Food donation accepted and marked as collected! 🤝"
    );

}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

    const totalDonations =
        document.getElementById("totalDonations");

    const totalMeals =
        document.getElementById("totalMeals");

    const collectedFood =
        document.getElementById("collectedFood");

    const foodSaved =
        document.getElementById("foodSaved");


    const total =
        donations.length;


    const meals =
        donations.reduce(
            (sum, donation) =>
                sum + Number(donation.servings || 0),
            0
        );


    const collected =
        donations.filter(
            donation =>
                donation.status === "Collected"
        ).length;


    const saved =
        donations
            .filter(
                donation =>
                    donation.status === "Collected"
            )
            .reduce(
                (sum, donation) =>
                    sum + Number(donation.quantity || 0),
                0
            );


    if (totalDonations) {
        totalDonations.textContent =
            total;
    }


    if (totalMeals) {
        totalMeals.textContent =
            meals;
    }


    if (collectedFood) {
        collectedFood.textContent =
            collected;
    }


    if (foodSaved) {
        foodSaved.textContent =
            saved + " kg";
    }

}


// ==========================================
// SEARCH
// ==========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderDonations
    );

}


// ==========================================
// FORM SUBMIT
// ==========================================

if (donationForm) {

    donationForm.addEventListener(
        "submit",
        addDonation
    );

}


// ==========================================
// INITIAL LOAD
// ==========================================

renderDonations();

updateDashboard();