import { createAction, props } from '@ngrx/store';
import { Book } from '@tmo/shared/models';

export const BOOKS_SEARCH_BAR_ACTION = '[Books Search Bar] Search';
export const BOOKS_SEARCH_BAR_CLEAR_ACTION = '[Books Search Bar] Clear Search';
export const BOOKS_SEARCH_API_SUCCESS_ACTION = '[Book Search API] Search success';
export const BOOKS_SEARCH_API_FAILURE_ACTION = '[Book Search API] Search failure';

export const searchBooks = createAction(
  BOOKS_SEARCH_BAR_ACTION,
  props<{ term: string }>()
);

export const searchBooksSuccess = createAction(
  BOOKS_SEARCH_API_SUCCESS_ACTION,
  props<{ books: Book[] }>()
);

export const searchBooksFailure = createAction(
  BOOKS_SEARCH_API_FAILURE_ACTION,
  props<{ error: any }>()
);

export const clearSearch = createAction(BOOKS_SEARCH_BAR_CLEAR_ACTION);