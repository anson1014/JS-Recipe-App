import Search from './models/Search';
import * as searchView from './views/searchView'
import {elements, renderLoader, clearLoader} from './views/base';

// Global state of the app
// - Search Obj
// - Current Recipe Obj
// - Shopping List Obj
// - Liked recipes
const state = {};

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
})

