import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Subject, of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, takeUntil, tap } from 'rxjs/operators';
import { Book, ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class ReadingListEffects implements OnInitEffects, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>('/api/reading-list').pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) =>
        this.http.post('/api/reading-list', book).pipe(
          map(() => ReadingListActions.confirmedAddToReadingList({ book })),
          tap(() => {
            const snackBarRef: MatSnackBarRef<any> = this.snackBar.open('Added', 'Undo', {
              duration: 3000,
            });

            snackBarRef.onAction().pipe(
              takeUntil(this.destroy$)
            ).subscribe(() => {
              const readingListItem: ReadingListItem = {
                ...book,
                bookId: book.id,
              };
              this.store.dispatch(ReadingListActions.removeFromReadingList({ item: readingListItem }));
            });
          }),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      )
    ),
    { dispatch: false }
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          tap(() => {

            const snackBarRef: MatSnackBarRef<any> = this.snackBar.open('Removed', 'Undo', {
              duration: 3000,
            });

            snackBarRef.onAction().pipe(
              takeUntil(this.destroy$)
            ).subscribe(() => {
              const book: Book = {
                ...item,
                id: item.bookId
              };
              this.store.dispatch(ReadingListActions.addToReadingList({ book }));
            });
          }),
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList({ item })
          ),
          catchError(() =>
            of(ReadingListActions.failedRemoveFromReadingList({ item }))
          )
        )
      )
    ),
    { dispatch: false }
  );

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions, private http: HttpClient, private snackBar: MatSnackBar, private readonly store: Store) { }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}