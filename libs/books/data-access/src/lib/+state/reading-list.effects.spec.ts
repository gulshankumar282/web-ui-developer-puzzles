import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { SharedTestingModule } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarMock } from './../mat-snack-bar.mock';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;
  let snackBarMock: MatSnackBarMock;

  beforeEach(() => {
    snackBarMock = new MatSnackBarMock();
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      providers: [
        { provide: MatSnackBar, useValue: snackBarMock },
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });
  });


  describe('addBookToList$', () => {
    it('should add the book to reading list when undo action will trigger ', fakeAsync((done) => {

      const item = { bookId: '123', title: 'Test Book', authors: ['Test Author'], description: 'Test Book Description' };
      const book = { id: '123', title: 'Test Book', authors: ['Test Author'], description: 'Test Book Description' };
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      actions.next(ReadingListActions.removeFromReadingList({ item }));

      snackBarMock.onActionSubject.next();
      tick();

      effects.addBook$.subscribe(action => {
        expect(httpMock.expectOne(`/api/reading-list/${item.bookId}`)).toBeTruthy(); // Verify the URL of the HTTP request
        expect(action).toEqual(ReadingListActions.confirmedAddToReadingList({ book }))
        done();
      });
    }));
  });

  describe('removeBookFromList$', () => {
    it('should remove the book from reading list when undo action will trigger ', fakeAsync((done) => {

      const item = { bookId: '123', title: 'Test Book', authors: ['Test Author'], description: 'Test Book Description' };
      const book = { id: '123', title: 'Test Book', authors: ['Test Author'], description: 'Test Book Description' };
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      actions.next(ReadingListActions.addToReadingList({ book }));

      snackBarMock.onActionSubject.next();
      tick();

      effects.removeBook$.subscribe(action => {
        expect(httpMock.expectOne(`/api/reading-list/${item.bookId}`)).toBeTruthy(); // Verify the URL of the HTTP request
        expect(action).toEqual(ReadingListActions.confirmedRemoveFromReadingList({ item }))
        done();
      });
    }));
  });
});