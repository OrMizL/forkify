import View from './View.js';
import icons from 'url:../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1 and other pages
    if (currentPage === 1 && numPages > 1) {
      return this._getNextPageMarkup(currentPage);
    }
    // Last page
    if (currentPage === numPages && numPages > 1) {
      return this._getPrevPageMarkup(currentPage);
    }
    // Other page (> 1 and < numPages)
    if (currentPage < numPages) {
      return `${this._getPrevPageMarkup(currentPage)}${this._getNextPageMarkup(
        currentPage
      )}`;
    }
    // Page 1 and no other pages
    return '';
  }
  // Generating markup for the next page button
  _getNextPageMarkup(currentPage) {
    return `
      <button data-goto="${
        currentPage + 1
      }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
  }
  // Generating markup for the prev page button
  _getPrevPageMarkup(currentPage) {
    return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
      `;
  }
}

export default new PaginationView();
