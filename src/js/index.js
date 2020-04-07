import Search from './models/Search';


// Global state of the app
// - Search Obj
// - Current Recipe Obj
// - Shopping List Obj
// - Liked recipes
const state = {};

const controlSearch = async () => {
    // 1) get the query
    const query = 'pizza';

    if (query) {
        // 2) New search obj and add to state
        state.search = new Search(query);

        // 3) Prep the UI for results;

        // 4) search for recipes
        await state.search.getResults();

        // 5) render results on UI
        console.log(state.search.result);
    }
}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

