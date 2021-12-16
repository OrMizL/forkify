import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage =
    'Sorry, no recipes were found. Please try a different keyword! 🍒';
  _message;

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new ResultsView();
