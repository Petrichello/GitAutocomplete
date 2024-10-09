const input = document.querySelector('input');
const search = document.querySelector('.search');
const repositoriesList = document.querySelector('.repositories');
let repositories;

const debounce = (fn, ms) => {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            fn.apply(this, args);
        }, ms);
    }
};

const deleteAutoComplete = function() {
    const autocomplete = document.querySelector('.autocomplete');
    autocomplete.remove();
}

const addRepository = function(event) {
    deleteAutoComplete();
    input.value = '';

    repositories.forEach((repository) => {
        if (repositories.indexOf(repository) === parseInt(event.srcElement.className)) {
            repositoriesList.insertAdjacentHTML('beforeend', `<li class="repositoriesItem">
                <p>Name: ${repository.name}</p>
                <p>Owner: ${repository.owner.login}</p>
                <p>Stars: ${repository.stargazers_count}</p>
                <div class="cross"></div>
            </li>`);
        }
    })

    let crosses = document.querySelectorAll('.cross');
    for (let cross of crosses) {
        cross.addEventListener('click', (event) => {
            event.target.parentElement.remove()
        });
    }
}

const showAutoComplete = function(items) {
    if (document.querySelector('.autocomplete')) {
        deleteAutoComplete();
    }

    repositories = [];
    const autocomplete = document.createElement('ul');
    autocomplete.className = 'autocomplete';

    search.append(autocomplete);
    for (let i = 0; i < 5; i++) {
        repositories.push(items[i]);
        autocomplete.insertAdjacentHTML('beforeend', `<li class="${i}item autocompleteItem">${items[i].name}</li>`);
    }

    let autocompleteItems = document.querySelectorAll('.autocompleteItem');
    for (let li of autocompleteItems) {
        li.addEventListener('click', addRepository);
    }
}

const getRepositories = async function(event) {
    let string = input.value.trim();
    if (event.keyCode !== 32 && string !== '') {
        await fetch(`https://api.github.com/search/repositories?q=${string}`)
            .then(response => {
                return response.json();
            })
            .then(posts => {
                showAutoComplete(posts.items);
            })
            .catch((error) => {
                console.log(error);
            })
    } else if (input.value === '' && event.keyCode === 8 && document.querySelector('.autocomplete')) {
        deleteAutoComplete();
    }
}

input.addEventListener('keydown', debounce(getRepositories, 500));