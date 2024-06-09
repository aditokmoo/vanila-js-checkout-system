const mainWrapper = document.querySelector(".resorces-cart");
// Declare cart to store cart items
var cart = [];
// Declare download button that we click to save to cart
const download_button = document.querySelectorAll(".download-link");
// Declare data that we pull from localStorage
const storage = localStorage.getItem("cart");
// Check if storage data exist
if (storage) {
    // Overwrite cart data if there is storage data we parse it if not we return empty array
    cart = JSON.parse(storage) || [];
}

// Update Cart Length
function updateCartLength() {
    const cartLength = document.querySelector(".cart-number");
    cartLength.innerText = cart.length;
}

updateCartLength();

// DISPLAY DATA IN CART
cart.forEach((item) => {
    // Create single item card and add class
    const singleItem = document.createElement("div");
    singleItem.classList = "single-item";
    // Create item title, add value, and give it class
    const title = document.createElement("div");
    title.innerText = item.title;
    title.classList = "text-34px";
    // Create item content
    const content = document.createElement("div");
    content.classList = "item-content";

    // LEFT SECTION

    // Create left section = IMAGE
    const leftSection = document.createElement("div");
    leftSection.classList = "image-wrapper";
    // Create image element and give it a class
    const image = document.createElement("img");
    image.src = item.image;
    image.classList = "preview-image";
    // Create removeBtn link element
    const removeBtn = document.createElement("a");
    removeBtn.href = "#";
    removeBtn.classList = "remove-btn";
    removeBtn.innerText = "REMOVE";

    // RIGHT SECTION

    // Create right section = RESOURCE
    const rightSection = document.createElement("div");
    rightSection.classList = "resource-details";
    // Create resource title
    const resourceTitle = document.createElement("div");
    resourceTitle.classList = "text-28px color-text-blue";
    resourceTitle.innerText = "SELECTED RESOURCE";
    // Create resource list
    const resourceList = document.createElement("ul");
    resourceList.classList = "text-25px color-text-blue";

    item.resource.forEach((src, index) => {
        const li = document.createElement("li");
        li.innerText = src;
        resourceList.appendChild(li);
    });

    // COMBINE ALL ELEMENTS IN ONE CART ITEM
    rightSection.appendChild(resourceTitle);
    rightSection.appendChild(resourceList);

    leftSection.appendChild(image);
    leftSection.appendChild(removeBtn);

    content.appendChild(leftSection);
    content.appendChild(rightSection);

    singleItem.appendChild(title);
    singleItem.appendChild(content);

    mainWrapper?.appendChild(singleItem);
});

// ADD DATA TO CART
download_button.forEach((btn) => {
    // Add click event on every button
    btn.addEventListener("click", () => {
        // Declare resource card from which I need to take data
        const resourceCard = btn.closest(".resources-card");
        // Declare [image, title] from resource card
        const resourceCardImage =
        resourceCard.querySelector(".resources-image").src;
        const resourceCardTitle =
        resourceCard.querySelector(".resource-name").innerText;
        // Check if the item already exists in the cart
        const itemExists = cart.some((item) => item.title === resourceCardTitle);

        if (!itemExists) {
            // Take data from card
            const cardData = {
                image: resourceCardImage,
                title: resourceCardTitle,
                resource: [
                    document.querySelector(".resource-data-1").innerText,
                    document.querySelector(".resource-data-2").innerText,
                    document.querySelector(".resource-data-3").innerText,
                ],
                pdf_link: resourceCard.querySelector('.download-file').href,
            };
            // Store data in cart
            cart.push(cardData);
            // Save data in localStorage
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartLength();
        } else {
            alert("Item already in cart");
        }
    });
});

// REMOVE DATA FROM CART
const remove_button = document.querySelectorAll(".remove-btn");

remove_button.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const resourceCard = e.target.closest(".single-item");
        const title = resourceCard.querySelector(".text-34px").innerText;

        // Remove the item from the cart array
        cart = cart.filter((item) => item.title !== title);

        // Update the local storage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Remove the item from the UI
        resourceCard.remove();

        updateCartLength();
    });
});

// CLEAR ALL FROM CART
const clear_button = document.querySelector(".clear-cart");

clear_button?.addEventListener("click", (e) => {
    e.preventDefault();

    // Clear the cart array
    cart = [];

    // Remove all items from localStorage
    localStorage.removeItem("cart");

    // Remove all items from the UI
    const cartItems = document.querySelectorAll(".single-item");
    cartItems.forEach((item) => item.remove());

    updateCartLength();
});

const reviewList = document.querySelector('.list-names')

cart.forEach(item => {
    const selectedItems = document.createElement('li');
    selectedItems.innerText = item.title;
    reviewList?.appendChild(selectedItems)
})

const download_all_files_zip = document.querySelector(".download-btn");

download_all_files_zip?.addEventListener("click", async () => {
    const zip = new JSZip();
    
    // Loop through each item in the cart and fetch the PDFs
    for (const item of cart) {
        try {
            const response = await fetch(item.pdf_link);
            if (!response.ok) throw new Error(`Error fetching ${item.pdf_link}`);
            const blob = await response.blob();
            zip.file(item.title + ".pdf", blob);
        } catch (error) {
            console.error(`Failed to download ${item.pdf_link}:`, error);
        }
    }

    // Generate the zip file and trigger download
    zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "pdf_files.zip");
    });
});
