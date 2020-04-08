import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import {elements, renderLoader, clearLoader} from './views/base';

// Global state of the app
// - Search Obj
// - Current Recipe Obj
// - Shopping List Obj
// - Liked recipes
const state = {};


///// SEARCH CONTROLLER 
const controlSearch = async () => {
    // 1) get the query
    const query = searchView.getInput();
    console.log(query);

    if (query) {
        // 2) New search obj and add to state
        state.search = new Search(query);

        // 3) Prep the UI for results;
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        // 4) search for recipes
        await state.search.getResults();

        // 5) render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


///// RECIPE CONTROLLER

const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', '');

    if (id) {
        // prep the UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        // highlight selected recipe
        if (state.search) {
            searchView.highlightSelected(id);
        }
        // create new recipe obj
        state.recipe = new Recipe(id);

        try {
            // get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            // calculate servings and time
             state.recipe.calcTime();
             state.recipe.calcServings();
            // render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch (error) {
            console.log(error);
        }
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');   
            recipeView.updateServingsIngredients(state.recipe);
        }
        
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc'); 
        recipeView.updateServingsIngredients(state.recipe);
    }
})