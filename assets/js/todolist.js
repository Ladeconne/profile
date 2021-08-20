//Accessors - Qu'est ce que je vais moditifer avec javascript.
const todoInput = document.querySelector(".todo-input");
const addButton = document.querySelector(".add-button");
const todoList = document.querySelector(".todo-list");
const filterTodos = document.querySelector(".filter-todos");

//Even Listerners
//lorsque le DOM a fini de charger, je créé les todo qui sont stocké en mémoire
document.addEventListener("DOMContentLoaded", getLocalTodos);
// J'ajoute un listener sur le bouton
addButton.addEventListener("click", createTodo);
//Je crée un listner sur la todoList
todoList.addEventListener("click", deleteCheck);
filterTodos.addEventListener("change", filterTodo);

//Functions
//la fonction create Todo va créer les elements de to do
function createTodo(e) {
    e.preventDefault();
    if(todoInput.value === ""){
        todoInput.value = "Define your task!"
    }else{
    //Je crée un div to do qui va contenir le texte et le trash
    const todoItem = document.createElement("div");
    todoItem.classList.add("todoItem");
    todoList.appendChild(todoItem);
    
    //Todo element where the text will be displayed
    const todo = document.createElement("li");
    todo.innerText = todoInput.value;
    todo.classList.add("todo");
    todoItem.appendChild(todo);
    localSaveTodos(todo.innerText);
    // La validate element à coté du texte
    const todoVal = document.createElement("button");
    todoVal.innerHTML = '<i class="fas fa-check-double"></i>';
    todoVal.classList.add("todoVal");
    todoItem.appendChild(todoVal);

    // La trash element à coté du texte
    const todoDel = document.createElement("button");
    todoDel.innerHTML = '<i class="fas fa-recycle"></i>';
    todoDel.classList.add("todoDel");
    todoItem.appendChild(todoDel);


    //On remet à vide l'input
    todoInput.value = "";
    }
}

function deleteCheck(e) {
    const item =  e.target;
    if(item.classList[0] === "todoDel"){
        item.parentElement.remove();
        deleteFromStorage(item);
    };
    if(item.classList[0] === "todoVal"){
        item.parentElement.classList.toggle('completed');
    }
}

function filterTodo(e) {
    //je définie l'array de todo item.
    let todoListArray = todoList.childNodes;

    //Suivant le cas j'affiche ou non les items en modifiant leur valeur css de display.
    switch(e.target.value){
        //tous les items ont un display normal (flex)
        case "All":
            todoListArray.forEach(todo => {
                    todo.style.display = "flex";
            });
            break;
        case "Completed":
            todoListArray.forEach(todo => {
                if(todo.classList.contains("completed")){
                    todo.style.display = "flex";
                }
                else{
                    todo.style.display = "none";
                }
            });
            break;
        case "Uncompleted":
            todoListArray.forEach(todo => {
                if(todo.classList.contains("completed")){
                    todo.style.display = "none";
                }
                else{
                    todo.style.display = "flex";
                }
            });
            break;
    }
}

function localSaveTodos(todo){
    let todos;
    //Check if local storage is empty
    if(localStorage.getItem('todos') === null){
        todos = [];
    } else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    //J'ajoute à la fin de mon array todos le nouveau "todo"
    todos.push(todo);
    
    //Je set dans le localStorage la nouvelle array
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getLocalTodos(todo){
    let todos;
    //Check if local storage is empty
    if(localStorage.getItem('todos') === null){
        todos = [];
    } else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    //Je veux reconstruire les li pour tous les todos de la liste
    todos.forEach(todoText => {
        const todoItem = document.createElement("div");
        todoItem.classList.add("todoItem");
        todoList.appendChild(todoItem);
    
        //Todo element where the text will be displayed
        const todo = document.createElement("li");
        todo.innerText = todoText;
        todo.classList.add("todo");
        todoItem.appendChild(todo);
        
        // La validate element à coté du texte
        const todoVal = document.createElement("button");
        todoVal.innerHTML = '<i class="fas fa-check-double"></i>';
        todoVal.classList.add("todoVal");
        todoItem.appendChild(todoVal);

        // La trash element à coté du texte
        const todoDel = document.createElement("button");
        todoDel.innerHTML = '<i class="fas fa-recycle"></i>';
        todoDel.classList.add("todoDel");
        todoItem.appendChild(todoDel);

    })
}

function deleteFromStorage(todo){
    //Je récupère la valeur qu'il y a dans le li
    const todoText = todo.parentElement.childNodes[0].innerText;
    //Je récupère ce qu'il y a en mémoire local et je le transforme en array
    let todos = JSON.parse(localStorage.getItem('todos'));
    
    //J'enleve le todo de l'array
    todos.splice(todos.indexOf(todoText), 1);
    //Je recharge la nouvelle array todos dans le storage local
    localStorage.setItem('todos', JSON.stringify(todos));
}
