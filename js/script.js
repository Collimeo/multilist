// (function() {
import { brighten, invert } from "./modules/colors.js";
import createPopup from "./modules/popup.js";

const addBtn = document.querySelector('.add__btn'),
    input = document.querySelector('input'),
    body = document.querySelector('body'),
    newCat = document.querySelector('.newCategory__btn');

let selection = "nocat", 
    i = 0,
    newListClass = "nocat";


input.focus();

//------------------------------------
// STORAGE SETUP
//------------------------------------

window.addEventListener("load", () => {
    if(localStorage.categories) {

        // Load categories
        let categories = JSON.parse(localStorage.categories);
        let list
        categories.map(cat => {
            addCategory(cat.id, cat.name, cat.color);
            list = JSON.parse(localStorage.getItem(cat.id));
            if(list) {
                selection = `cat${cat.id}`
                list.map(item => {
                    addItem(item)
                })
            }
            i = cat.id;
        })
        
    }
})

function saveToLS(id, value) {
    if(!localStorage.getItem(id)) {
        localStorage.setItem(id, JSON.stringify(Array(value)));
    } else {
        let storageTemp = JSON.parse(localStorage.getItem(id));
        storageTemp.push(value);
        localStorage.setItem(id, JSON.stringify(storageTemp));
    }
}

function saveCategoryToLS(id, name, color) {
    let categoryData = {
        "id": id,
        "name": name,
        "color": color,
    };

    if(!localStorage.categories || JSON.parse(localStorage.categories).length === 0) {
        localStorage.setItem('categories', JSON.stringify(Array(categoryData)));
    } else {
        let categoryDataTemp = JSON.parse(localStorage.getItem('categories'));
        categoryDataTemp.push(categoryData);
        localStorage.setItem('categories', JSON.stringify(categoryDataTemp));
    }
}

//TWORZENIE KARTY KATEGORII

function addDelButton(className, id) {
    let del = document.createElement("img");
    del.setAttribute("src", '../media/close.png')
    del.setAttribute("class", `delBtn ${className}`);
    // del.textContent = "x";

    del.addEventListener("click", (e) => {

        if(id) {
            if(e.target.className.includes("category__item")) //jesteśmy w item, nie category
            {
                let itemArr = JSON.parse(localStorage.getItem(id));
                itemArr.splice(itemArr.indexOf(e.target.parentNode.textContent), 1);
                localStorage.setItem(id, JSON.stringify(itemArr))
                // console.log(e.target.parentNode.textContent)
            } else {
                let categories = JSON.parse(localStorage.categories)
                categories.splice(categories.findIndex(x => x.id === id), 1);
                localStorage.removeItem(id);
                localStorage.setItem('categories', JSON.stringify(categories));
            }
        }

        e.target.parentNode.remove();
        input.focus();
        
    });

    return del;
}

function removeSelection() {
    let allCategoryCards = document.querySelectorAll("div.category");
    allCategoryCards.forEach(
        function(catCard) {
            catCard.className.includes("activated") ? catCard.classList.remove('activated') : null;
            // console.log(catCard.className.includes("activated"));
    });
}

function createNewList(id, categoryName, color) {
    const cards = document.querySelector(".cards");
    let listContainer = document.createElement("div");

    let categoryTitle = document.createElement("h3");
    categoryTitle.setAttribute("class", "category__title");
    categoryTitle.textContent = categoryName;

    let list = document.createElement("ul");
    list.setAttribute("class", `cat${id}__list category__list`);

    listContainer.setAttribute("class", `cat${id} category grid-item activated`);
    // listContainer.setAttribute("style", `background: ${color}`);
    listContainer.style.background = color
    listContainer.style.color =  invert(color)
    listContainer.addEventListener("click", (e) => {
        e.stopPropagation();
        selection = e.currentTarget.classList[0];
        removeSelection();
        e.currentTarget.className = e.currentTarget.className.concat(" activated");
        input.focus();
    }, false)

    let closeList = addDelButton("category__remove", id);

    if(localStorage.categories) {
        if(!JSON.parse(localStorage.categories).find(x => x.id === id))
            saveCategoryToLS(id, categoryName, color);
    } else {
        saveCategoryToLS(id, categoryName, color);
    }

    listContainer.appendChild(categoryTitle);
    listContainer.appendChild(list);
    listContainer.appendChild(closeList);
    cards.appendChild(listContainer);
}

//-----------------------------------------------------------
// ITEMS ADDING

function addItem(value) {
    let list = document.querySelector(`ul.${selection}__list`)
    let del = addDelButton("category__item--remove", Number(selection.slice(3)));
    let item = document.createElement("li");
    item.setAttribute("class", "category__item")

    let span = document.createElement("span");
    // item.setAttribute("draggable", "true");
    span.textContent = value;

    span.addEventListener("click", (e) => {
        e.stopPropagation();
        if(e.currentTarget.classList.contains("washedOut")) {
            e.currentTarget.classList.remove("washedOut");
            del.remove();
        } else {
            e.currentTarget.classList.add("washedOut");
            item.appendChild(del);
        } 
    }, false)



    if(input.value)
        saveToLS(Number(selection.slice(3)), value);
 
    item.appendChild(span);
    list.appendChild(item);
    input.value = "";
}

addBtn.addEventListener("click", (e) => {
    if (input.value) {
        e.preventDefault();
        addItem(input.value);
        input.focus();
    } else if (!input.value) {
        alert("enter some txt firts");
    } else if (selection === "nocat") {
        alert("select category");
    }
});

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && input.value && selection !== "nocat") {
        addItem(input.value);
    } else if (e.key === "Enter" && !input.value) {
        alert("enter some txt firts");
    } else if (e.key === "Enter" && selection === "nocat") {
        alert("select category");
    }
})

//-----------------------------
// INPUT CATEGORY

function showNewCategory() {

    if(!document.querySelector(".newCategory__container")) {
        createPopup();
        const newCategory = document.querySelector(".popup");
        const newCategoryTitle = document.createElement('h2');
        newCategoryTitle.setAttribute("class", "newCategory__title");
        newCategoryTitle.textContent = 'Create new category';
        const categoryContainer = document.createElement("div");
        categoryContainer.setAttribute("class", "newCategory__container")
    
        let categoryInput = document.createElement("input");
        categoryInput.setAttribute("class", "newCategory__input");
        categoryInput.setAttribute("type", "text");
        categoryInput.placeholder = "enter category name";
    
        //--------- COLOR PICKER
    
        let $picker = document.createElement("div");
        $picker.setAttribute("id", "colorPicker");
        let pickerColor = document.createElement("a");
        pickerColor.setAttribute("class", "color");
        let colorInner = document.createElement("div");
        colorInner.setAttribute("class", "colorInner");
        let track = document.createElement("div");
        track.setAttribute("class", "track");
        let dropdown = document.createElement("ul");
        dropdown.setAttribute("class", "dropdown");
        let pickerList = document.createElement("li");
        let colorInput = document.createElement("input");
        colorInput.setAttribute("class", "colorInput");
        colorInput.setAttribute("type", "hidden");
        colorInput.value = "#FFF";
    
        dropdown.appendChild(pickerList);
        pickerColor.appendChild(colorInner);
        $picker.appendChild(pickerColor);
        $picker.appendChild(track);
        $picker.appendChild(dropdown);
        $picker.appendChild(colorInput);
    
        let tinyPickerScript = document.createElement("script");
        tinyPickerScript.setAttribute("src", "js/tinycolorpicker.min.js");
        tinyPickerScript.setAttribute("class", "tinyPickerScript");
        document.body.appendChild(tinyPickerScript);
    
        let categoryAddBtn = document.createElement("button");
        categoryAddBtn.textContent = "Add";
        categoryAddBtn.setAttribute("class", "newCategory__add");
    
        let del = document.createElement("img");
        del.setAttribute("src", '../media/close.png')
        del.setAttribute("class", `delBtn newCategory__del`);
        del.addEventListener('click', () => {
            hideNewCategory();
            input.focus();
        })

        categoryContainer.appendChild(newCategoryTitle);
        newCategory.appendChild(del);
        categoryContainer.appendChild(categoryInput);
        categoryContainer.appendChild($picker);
        categoryContainer.appendChild(categoryAddBtn);
        newCategory.appendChild(categoryContainer);
        categoryInput.focus();

        document.querySelector('.overlay').addEventListener('click', () => {
            hideNewCategory();
        }, false)
    
        tinyPickerScript.onload = () => {
            let picker = tinycolorpicker($picker);
        }

        document.querySelector('.track').addEventListener("click", () => {
            newCategory.style.backgroundColor = colorInput.value;
            newCategoryTitle.style.color = invert(colorInput.value);
            categoryInput.style.color = invert(colorInput.value);
            categoryAddBtn.style.color = invert(colorInput.value);
        })

        categoryAddBtn.addEventListener("click", () => {
            i++;
            addCategory(i, categoryInput.value, colorInput.value);
            hideNewCategory();
            input.focus();
        })

        categoryInput.addEventListener("keypress", (e) => {
            if(e.keyCode === 13) {
                i++;
                addCategory(i, categoryInput.value, colorInput.value);
                hideNewCategory();
                input.focus();
            }
        })

    }
    
}

function addCategory(id, catName, color) {
    newListClass = `cat${id}`;
    selection = newListClass;
    removeSelection();
    createNewList(id, catName, color);
}

function hideNewCategory() {
    document.querySelector(".popup").remove();
    document.querySelector('.overlay').remove();
    document.querySelector(".tinyPickerScript").remove();
}

newCat.addEventListener("click", () => {
    document.querySelector(".newCategory__input") ? hideNewCategory() : showNewCategory();
})

window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.keyCode === 77) {
        e.preventDefault();
        document.querySelector(".newCategory__input") ? hideNewCategory() : showNewCategory();
    }
    if(e.key === 'Escape' && document.querySelector('.popup')) {
        hideNewCategory();
    }
});

// BG COLOR SWITCH

let colorSelector = document.querySelectorAll('.colorSelector');
colorSelector.forEach(gradient => {
    gradient.addEventListener("click", (e) => {
        body.style.backgroundImage = getComputedStyle(gradient).backgroundImage;
        colorSelector.forEach(item => {
            item.classList.remove("activated")
        })
        gradient.classList.add("activated")
    })
})

//-------------------------------------------------------------

//GRID MASONRY

let masonry = new Masonry('.grid', {
    itemSelector: '.grid-item',
    columnWidth: 380
})

// })();