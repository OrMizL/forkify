import * as model from './model.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from '../views/recipeView.js';
import searchView from '../views/searchView.js';
import resultsView from '../views/resultsView.js';
import paginationView from '../views/paginationView.js';
import bookmarksView from '../views/bookmarksView.js';
import addRecipeView from '../views/addRecipeView.js';
import { MODAL_CLOSE_TIMOUT_SEC } from './config.js';

// if (module.hot) {
//   module.hot.accept();
// }

// part of the publisher-subscriber design pattern - handling events listened to in the view
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

// Fetching recipe data and rendering it to the page
const controlRecipes = async function () {
  try {
    // Getting a recipe hash from the url
    const id = window.location.hash.slice(1);

    if (!id) return;
    // Render spinner
    recipeView.spinnerRender();

    // Marking selected recipe in the list and bookmarks list
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // Loading recipe using model
    await model.loadRecipe(id);

    // Rendering received data to the page
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    // console.log(err);
  }
};

// Fetching results from the search bar
const controlSearchResults = async function () {
  try {
    resultsView.spinnerRender();
    // get query from search bar
    const query = searchView.getQuery();
    // guard clause
    if (!query) return;
    // load search results
    await model.loadSearchResults(query);
    // render results
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.searchResults);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.searchResults);
};

const controlServings = function (newServings) {
  model.updateNewServings(newServings);

  // Rendering to page
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Adding/Removing bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Updating recipe view
  recipeView.update(model.state.recipe);

  // Adding/Removing bookmarks list - render
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show spinner
    addRecipeView.spinnerRender();

    // Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Render bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Display success message
    addRecipeView.renderMessage();

    // Close form - only after timeout
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_TIMOUT_SEC * 1000);

    console.log(model.state.bookmarks);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

// initializing the app - important for event handlers and publisher-subscriber pattern
init();
