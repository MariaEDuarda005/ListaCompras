// SELECIONAR OS ITENS

const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// editar a opinião

let editElement;
let editFlag = false;
let editID = "";

// event listeners
// submit form 

form.addEventListener('submit', addItem);
// clear item
clearBtn.addEventListener('click', clearItems);
// load items
window.addEventListener('DOMContentLoaded', setupItems);

//"e" é frequentemente utilizado como um parâmetro para representar um evento em uma função JavaScript
function addItem(e){
    e.preventDefault();
    //console.log(grocery.value);
    const value = grocery.value;
    // if (value){
    //     console.log("value is truthy");
    // }
    // if(!value){
    //     console.log("value is falsy")
    // }
    const id = new Date().getTime().toString();
    //console.log(id);
    // mesma coisa = value !== '' && editFlag === false
    if(value && !editFlag){
        createListItem(id, value)
        //display child
        displayAlert('item added to the list', 'success');
        //show container
        container.classList.add("show-container");
        // add to local storage
        addToLocalStorage(id, value);
        // set back to default
        setBackToDefault();

    // mesma coisa = value !== '' && editFlag === true
    }else if(value && editFlag){
        //console.log('editing');
        editElement.innerHTML = value;
        displayAlert('value changed', 'success');
        // edit local storage
        editLocalStorage(editID, value);
        setBackToDefault()
    }else{
        displayAlert('please enter value', 'danger');
        //console.log('empty value');
    }
}

// display alert
function displayAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    // remove alert
    setTimeout(function(){
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
    }, 1000)
}

// clear items
function clearItems(){
    const items = document.querySelectorAll('.grocery-item');
    if (items.length > 0){
        items.forEach(function(item){
            list.removeChild(item);
        })
    }
    container.classList.remove("show-container");
    displayAlert("empty list", "danger");
    setBackToDefault();
    localStorage.remove("list")
}

// edit function
function editItem(){
    console.log('adit item');
}

// delete function
function deleteItem(e){
    //console.log('item deleted');
    // event.currentTarget é uma propriedade que fornece uma referência ao 
    // objeto no qual o manipulador de eventos está atualmente sendo executado
    //usada em funções de manipulação de eventos para determinar qual elemento está "ouvindo" 
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0){
        container.classList.remove("show-container")
    }
    displayAlert("item removed", 'danger');
    setBackToDefault();
    // remove from local storege
    // removeFromLocalStorage(id);
}

// edit function
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    // set edit 
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "edit";
}

// set back to default
function setBackToDefault(){
    //console.log("Set back to default")
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}

// local Storage
function addToLocalStorage(id, value){
    // : é utilizado para criar pares chave-valor em objetos -> id:id, value:value
    // criando o objeto grocery e criando duas propriedades
    const grocery = {id, value};
    let items = getLocalStorage();
    // console.log(items)
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
    //console.log("edded to local storage")
}
function removeFromLocalStorage(id) {
    let items = getLocalStorage();
    items = items.filter(function(item){
        if(item.id !== id){
            return item
        }
    });
    localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
    let items = getLocalStorage();
    items = items.map(function(item){
        if(item.id === id){
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}
function getLocalStorage(){
    return localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[];
}
// exemplo de como colocar no local storege -  set e get
// localStorage.setItem('orange', JSON.stringify(['item', 'item']));
// const oranges = JSON.parse(localStorage.getItem('orange'));
// console.log(oranges);
// como remover
// localStorage.removeItem("orange");

// setup items

function setupItems(){
    let items = getLocalStorage();
    if (items.length > 0){
        items.forEach(function(item){
            createListItem(item.id, item.value)
        });
        container.classList.add('show-container')
    }
}

function createListItem(id, value){
    console.log('add item to the list');
    const element = document.createElement('article');
    // add class
    element.classList.add('grocery-item');
    // add id
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${value}</p>
                <div class="btn-container">
                    <button type="button" class="edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>`;

    // const deleteBtn = element.querySelector('.delete-btn');
    // const editBtn = element.querySelector('.edit-btn');
    // deleteBtn.addEventListener('click', deleteItem);
    // editBtn.addEventListener('click', editItem);

    // add event listeners to both buttons;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    // append child
    list.appendChild(element);
}