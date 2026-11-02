const restaurants = {
    j1: {
        name: "Eat & Meet",
        website: "https://eatandmeet.sk/tyzdenne-menu",
        sourceUrl: "source/J1_eatandmeat.html",
        parseWeek: create_WeekMenu_LIST_fromJ1
    },
    j2: {
        name: "Naše Hospoda",
        website: "https://www.nasehospoda-karloveska.sk/",
        sourceUrl: "source/J2_nasehospoda.html",
        parseWeek: create_WeekMenu_LIST_fromJ2
    },
    j3: {
        name: "FiitFood",
        website: "http://www.freefood.sk/menu/#fiit-food",
        sourceUrl: "source/J3_freefood.html",
        parseWeek: create_WeekMenu_LIST_fromJ3
    }

};

const LIST_of_created_HTML_Restaurant_Card = {};
const LIST_Restaurants_Week_Menus = {};
const daySelect = document.getElementById("day-select");
const dayNames = ["Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok"];




function clearMenuCache() {
    for (const restaurantId of Object.keys(restaurants)) {
        const cacheKey = restaurantId + "-menu-cache";

        localStorage.removeItem(cacheKey);

        LIST_of_created_HTML_Restaurant_Card[restaurantId].status.textContent = "Cache bola vymazaná.";
    }
}


function create_ITEMS_LIST_from_oneDay_J1(doc, day){
    const items = [];
    const mealsNodeList = doc.querySelectorAll("#day-" + day + " .menu-body");

    // <div id="day-1">
    //     <div class="menu-body">
    //         <h4>Polievka 1</h4>
    //         <p class="menu-description">Paradajková polievka (1,7)</p>
    //         <span class="price">0,90 €</span>
    //     </div>
    //
    //     <div class="menu-body">
    //         <h4>MENU 1</h4>
    //         <p class="menu-description">Kurací rezeň (1,3)</p>
    //         <span class="price">4,50 €</span>
    //     </div>
    // </div>

    for (const meal of mealsNodeList){
        const category = meal.querySelector("h4").textContent.trim();
        const price = meal.querySelector(".price").textContent.trim();

        const NameAndAlergens = meal.querySelector(".menu-description").textContent.trim();
        const allergensMatch = NameAndAlergens.match(/\((\d+(?:\s*,\s*\d+)*)\)\s*$/);
        
        // allergensMatch[0] = (1,7)
        // allergensMatch[1] = 1,7
        
        let name = NameAndAlergens;
        let allergens = "";

        if (allergensMatch !== null) {
            allergens = "Alergény: " + allergensMatch[1];
            name = NameAndAlergens.slice(0, allergensMatch.index).trim();
        }
        
        items.push({  category: category, 
                      name: name, 
                      price: price, 
                      allergens: allergens });
    }
    return items;
}


function create_WeekMenu_LIST_fromJ1(doc) {
    const week = [];
    for (let day = 1; day <= 5; day++){
        const items = create_ITEMS_LIST_from_oneDay_J1(doc, day);
        week.push({
            day: day,
            items: items
        });
    }

    return week;
}


function create_ITEMS_LIST_from_oneDay_J2(doc, day) {
    const items = [];
    const daysNodeList = doc.querySelectorAll("#menu article.overflow-hidden");
    const mealsNodeList = daysNodeList[day-1].querySelectorAll(".divide-y > .flex");


    // <div class="flex">
    //     <div class="min-w-0">
    //         <div class="font-bold">Kurací rezeň</div>

    //         <div class="mt-1">
    //             <span>Hlavné jedlo</span>
    //             <span>Alergény: 1,3,7</span>
    //         </div>
    //     </div>

    //     <div class="shrink-0">7,50 €</div>
    // </div>

    for (const meal of mealsNodeList) {
        const name = meal.querySelector(".min-w-0 > .font-bold").textContent.replace(/\s+/g, " ").trim();
        const category = meal.querySelector(".min-w-0 > .mt-1 > span").textContent.replace(/\s+/g, " ").trim();
        const price = meal.querySelector(".shrink-0").textContent.replace(/\s+/g, " ").trim();
        const allergensElement = meal.querySelector(".min-w-0 > .mt-1 > span:nth-child(2)");

        let allergens = "";
        if (allergensElement !== null) {
            allergens = allergensElement.textContent.replace(/\s+/g, " ").trim();
        }

        items.push({
            category: category,
            name: name,
            price: price,
            allergens: allergens
        });
    }

    return items;
}


function create_WeekMenu_LIST_fromJ2(doc) {
    const week = [];

    for (let day = 1; day <= 5; day++) {
        const items = create_ITEMS_LIST_from_oneDay_J2(doc, day);
        const days = doc.querySelectorAll("#menu article.overflow-hidden");
        const date = days[day - 1].querySelector(".mt-1.font-bold.text-white").textContent.trim();

        week.push({
            day: day,
            date: date,
            items: items
        });
    }

    return week;
}


function create_ITEMS_LIST_from_oneDay_J3(doc, day) {
    const items = [];

    const daysNodeList = doc.querySelectorAll("#fiit-food .daily-offer > li");
    const mealsNodeList = daysNodeList[day - 1].querySelectorAll(".day-offer > li");

    // meal of mealsNodeList:
    //<li>
    //    <span class="brand">P.</span>
    //        Paradajková    polievka
    //        A:1,7
    //    <span class="brand price">  1.70€  </span>
    //</li>

    for (const meal of mealsNodeList) {
        const mealNode = meal.querySelector(".brand");
        const label = mealNode.textContent.trim();
        const price = meal.querySelector(".price").textContent.trim();

        const NameAndAlergens = mealNode.nextSibling.textContent.replace(/\s+/g, " ").trim();
        const allergensMatch = NameAndAlergens.match(/A:\s*(\d+(?:\s*,\s*\d+)*)\s*(\(V\))?\s*$/);
        
        // allergensMatch[0] = "A:1,3 (V)"
        // allergensMatch[1] = "1,3"
        // allergensMatch[2] = "(V)" or undefined
        
        let name = NameAndAlergens;
        if (name === "") { continue; }
        if (name.toLowerCase() === "zatvorené") { return []; }

        let allergens = "";

        if (allergensMatch !== null) {
            allergens = "Alergény: " + allergensMatch[1];
            name = NameAndAlergens.slice(0, allergensMatch.index).trim();
            
            if (allergensMatch[2]) {
                name += " (V)";
            }
        }
        

        let category = "Hlavné jedlo";

        if (label === "P.") {
            category = "Polievka";
        }

        items.push({
            category: category,
            name: name,
            price: price,
            allergens: allergens
        });

    }

    return items;
}


function create_WeekMenu_LIST_fromJ3(doc) {
    const week = [];
    const daysNodeList = doc.querySelectorAll("#fiit-food .daily-offer > li");
    
    // One Node Example:
    // <li>
    //     <span class="day-title"> pondelok, 26.10.2026 </span>
    //     <ul class="day-offer">
    //         <li>...polievka a cena...</li>
    //         <li>...1 hlavné jedlo a cena...</li>
    //         <li>...2 hlavné jedlo a cena...</li>
    //         <li>...3 hlavné jedlo a cena...</li>
    //     </ul>
    // </li>

    for (let day = 1; day <= 5; day++) {
        const items = create_ITEMS_LIST_from_oneDay_J3(doc, day);

        const title = daysNodeList[day - 1].querySelector(".day-title").textContent.trim();

        // ["pondelok", " 26.10.2026"] -> "26.10.2026"
        const date = title.split(",")[1].trim();
        

        week.push({
            day: day,
            date: date,
            items: items
        });
    }

    return week;
}


async function ImportFile_and_set_LocalStorage(restaurantId) {
    try{
        $(LIST_of_created_HTML_Restaurant_Card[restaurantId].status).text("Načítavam menu…");

        const response = await fetch(restaurants[restaurantId].sourceUrl);

        if(!response.ok){
            throw new Error("Nepodarilo sa načítať menu.");
        }

        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html,"text/html");

        LIST_Restaurants_Week_Menus[restaurantId] =  restaurants[restaurantId].parseWeek(doc);


        const cache = { timeUpdate: new Date().toISOString(),
                        menu: LIST_Restaurants_Week_Menus[restaurantId]
        };


        const cacheKey = restaurantId + "-menu-cache";
        localStorage.setItem(cacheKey, JSON.stringify(cache));
        
        
        showUpdateTime(cache.timeUpdate, restaurantId);
        show_Selected_Day_Menu_For_ONE_Restaurant(restaurantId);
        
        $(LIST_of_created_HTML_Restaurant_Card[restaurantId].status).text("Menu bolo načítané.");

    
    } catch (error) {
        $(LIST_of_created_HTML_Restaurant_Card[restaurantId].status).text("Nepodarilo sa načítať menu.");
        
        LIST_of_created_HTML_Restaurant_Card[restaurantId].menuContainer.replaceChildren();

        LIST_of_created_HTML_Restaurant_Card[restaurantId].lastUpdated.textContent = "";

        delete LIST_Restaurants_Week_Menus[restaurantId];
        
        console.error(error);
    } 
    

}

// MenuWriter
function ExportMenuFromList_and_AddToContainer(items, container) {
    if(items.length === 0){
        const message = document.createElement("p");
        message.className = "text-secondary py-3 mb-0";
        message.textContent = "Menu na tento deň nie je k dispozícii.";
        container.appendChild(message);
        return;
    }
    for (const item of items) {
        const mealElement = document.createElement("div");
        mealElement.className = "meal";

        if (item.category.toLowerCase().includes("polievka")) {
            mealElement.classList.add("meal-soup");
        }

        const categoryElement = document.createElement("span");
        categoryElement.className = "meal-category";
        categoryElement.textContent = item.category;

        const infoElement = document.createElement("div");

        const nameElement = document.createElement("span");
        nameElement.className = "meal-name";
        nameElement.textContent = item.name;
        infoElement.appendChild(nameElement);

        if (item.allergens) {
            const allergensElement = document.createElement("span");
            allergensElement.className = "meal-allergens";
            allergensElement.textContent = item.allergens;
            infoElement.appendChild(allergensElement);
        }

        const priceElement = document.createElement("span");
        priceElement.className = "meal-price";
        priceElement.textContent = item.price;

        mealElement.appendChild(categoryElement);
        mealElement.appendChild(infoElement);
        mealElement.appendChild(priceElement);

        container.appendChild(mealElement);
    }
}

function print_DayName_and_CALL_MenuWriter(data, container) {
    const dayHeading = document.createElement("h3");
    dayHeading.className = "h5 mt-4 mb-2";
    dayHeading.textContent = dayNames[data.day - 1];

    if (data.date) {
        dayHeading.textContent += " — " + data.date;
    }

    container.appendChild(dayHeading);
    ExportMenuFromList_and_AddToContainer(data.items, container);
}

function show_Selected_Day_Menu_For_ALL_Restaurant() {
    for (const restaurantId of Object.keys(restaurants)) {
        show_Selected_Day_Menu_For_ONE_Restaurant(restaurantId);
    }
}

function showUpdateTime(timeUpdate, restaurantId) {

    const timeElement = document.createElement("time");
    timeElement.dateTime = timeUpdate;
    timeElement.textContent = new Date(timeUpdate).toLocaleString("sk-SK");

    LIST_of_created_HTML_Restaurant_Card[restaurantId].lastUpdated.replaceChildren("Posledná aktualizácia: ", timeElement);  //<p> -> <p> + <time>

}

function show_Selected_Day_Menu_For_ONE_Restaurant(restaurantId) {
    if (LIST_Restaurants_Week_Menus[restaurantId] === undefined) { return; }

    LIST_of_created_HTML_Restaurant_Card[restaurantId].menuContainer.replaceChildren();

    if (daySelect.value === "all") {
        for (const dayMenu of LIST_Restaurants_Week_Menus[restaurantId]) {
            print_DayName_and_CALL_MenuWriter(dayMenu, LIST_of_created_HTML_Restaurant_Card[restaurantId].menuContainer);    
        }
    } else {
        print_DayName_and_CALL_MenuWriter(
            LIST_Restaurants_Week_Menus[restaurantId][Number(daySelect.value) - 1],
            LIST_of_created_HTML_Restaurant_Card[restaurantId].menuContainer);
    }
}

// helper for load_ONE_Restaurant_Data_from_CACHE
function check_Date_And_Return_Cache(cacheKey){
    if (localStorage.getItem(cacheKey) === null){
        return null;
    }

    const savedDate = new Date(JSON.parse(localStorage.getItem(cacheKey)).timeUpdate); // .parse - from JSON to JS
    const today = new Date();
    if (savedDate.toDateString() !== today.toDateString()){  // 2026-11-01T08:30:00 -> Sun Nov 01 2026
        return null;
    }

    return JSON.parse(localStorage.getItem(cacheKey));
    
}

async function load_ONE_Restaurant_Data_from_CACHE(restaurantId) {
    const cacheKey = restaurantId + "-menu-cache";
    const cache = check_Date_And_Return_Cache(cacheKey);

    if (cache !== null) {
        LIST_Restaurants_Week_Menus[restaurantId] = cache.menu;

        show_Selected_Day_Menu_For_ONE_Restaurant(restaurantId);
        showUpdateTime(cache.timeUpdate, restaurantId);

        LIST_of_created_HTML_Restaurant_Card[restaurantId].status.textContent = "Menu bolo načítané z cache.";

    } else {
        await ImportFile_and_set_LocalStorage(restaurantId);
    }
}

async function load_All_Restaurants_Data(allowCache = false) {
    
    $("#refresh, #clear-cache").prop("disabled", true); // disabled = true;

    try {
        const loadingAllRestaurants = [];  // list with promises

        for (const restaurantId of Object.keys(restaurants)) {
            let loadingOneRestaurant;

            if (allowCache) {
                loadingOneRestaurant = load_ONE_Restaurant_Data_from_CACHE(restaurantId);} 
            else {
                loadingOneRestaurant = ImportFile_and_set_LocalStorage(restaurantId);}

            loadingAllRestaurants.push(loadingOneRestaurant);
        }

        await Promise.allSettled(loadingAllRestaurants); // wait for fullfiled or rejected
    } finally {
        $("#refresh, #clear-cache").prop("disabled", false);
    }
}

function Review_Uncheked_Cards_and_Hide() {
    const restaurantCheckboxes = document.querySelectorAll("#restaurant-filters input");

    for (const checkbox of restaurantCheckboxes) {
        const restaurantId = checkbox.value;

        $(LIST_of_created_HTML_Restaurant_Card[restaurantId].card).prop("hidden", !checkbox.checked);
    }
}

function create_HTML_Restaurant_Card(restaurantId) {
    const restaurant = restaurants[restaurantId];

    const card = document.createElement("article");
    card.id = restaurantId;
    card.className = "restaurant-card bg-white border rounded-4 p-4 mb-4";

    const heading = document.createElement("h2");
    heading.className = "h4 fw-bold mb-3";

    const link = document.createElement("a");
    link.className = "text-decoration-none";
    link.textContent = restaurant.name;
    link.href = restaurant.website;
   
    heading.appendChild(link);

    const status = document.createElement("p");
    status.className = "status-badge mb-2";

    const lastUpdated = document.createElement("p");
    lastUpdated.className = "small text-secondary mb-0";
    
    const menuContainer = document.createElement("div");

    card.appendChild(heading);
    card.appendChild(status);
    card.appendChild(lastUpdated);
    card.appendChild(menuContainer);

    if (restaurantId === "j1") {
        const priceExplanation = document.createElement("p");
        priceExplanation.className = "small text-secondary mt-3 mb-0";
        priceExplanation.textContent = "Ceny: bežná cena / dotovaná cena pri predložení platnej karty ISIC.";

        card.appendChild(priceExplanation);
    }

    document.getElementById("menus").appendChild(card);

    return {
        card: card,
        status: status,
        lastUpdated: lastUpdated,
        menuContainer: menuContainer
    };
}




const today = new Date().getDay();
if (today >= 1 && today <= 5){
    daySelect.value = String(today);
} else {
    daySelect.value = "1";
}


for (const restaurantId of Object.keys(restaurants)) {
    LIST_of_created_HTML_Restaurant_Card[restaurantId] = create_HTML_Restaurant_Card(restaurantId);
}

Review_Uncheked_Cards_and_Hide();
load_All_Restaurants_Data(true);



$("#day-select").on("change", show_Selected_Day_Menu_For_ALL_Restaurant);

$("#clear-cache").on("click", clearMenuCache);

$("#refresh").on("click", function () { load_All_Restaurants_Data(false); });

$("#restaurant-filters").on("change", Review_Uncheked_Cards_and_Hide);