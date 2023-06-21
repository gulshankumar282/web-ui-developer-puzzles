import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { SharedTestingModule } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarMock } from './../mat-snack-bar.mock';
import { Action } from '@ngrx/store';

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

  describe('addBook$', () => {
    it('should dispatch confirmedAddToReadingList action on successful HTTP request', (done) => {
      const book = { title: 'Book 1', id: '123', authors: [], description: '' };
      actions = new ReplaySubject<Action>(1);
      actions.next(ReadingListActions.addToReadingList({ book }));

      effects.addBook$.subscribe((action) => {
        expect(action).toEqual(ReadingListActions.confirmedAddToReadingList({ book }));
        done();
      });

      const req = httpMock.expectOne('/api/reading-list');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(book);
      req.flush({});
    });

    it('should dispatch failedAddToReadingList action on failed HTTP request', (done) => {
      const book = { title: 'Book 1', id: '123', authors: ['author 1'], description: 'First book' };
      actions = new ReplaySubject<Action>(1);
      actions.next(ReadingListActions.addToReadingList({ book }));

      effects.addBook$.subscribe((action) => {
        expect(action).toEqual(jasmine.objectContaining({ type: ReadingListActions.failedAddToReadingList.type }));
        done();
      });

      const req = httpMock.expectOne('/api/reading-list');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(book);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('removeBook$', () => {
    it('should dispatch confirmedRemoveFromReadingList action on successful HTTP request', (done) => {
      const item = { bookId: '123', title: 'Book 1', authors: ['author 1'], description: 'First book' };
      actions = new ReplaySubject<Action>(1);
      actions.next(ReadingListActions.removeFromReadingList({ item }));

      effects.removeBook$.subscribe((action) => {
        expect(action).toEqual(ReadingListActions.confirmedRemoveFromReadingList({ item }));
        done();
      });

      const req = httpMock.expectOne(`/api/reading-list/${item.bookId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should dispatch failedRemoveFromReadingList action on failed HTTP request', (done) => {
      const item = { bookId: '123', title: 'Book 1', authors: ['author 1'], description: 'First book' };
      actions = new ReplaySubject<Action>(1);
      actions.next(ReadingListActions.removeFromReadingList({ item }));

      effects.removeBook$.subscribe((action) => {
        expect(action).toEqual(jasmine.objectContaining({ type: ReadingListActions.failedRemoveFromReadingList.type }));
        done();
      });

      const req = httpMock.expectOne(`/api/reading-list/${item.bookId}`);
      expect(req.request.method).toBe('DELETE');
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('finishReadingBook$', () => {
    it('should not dispatch any actions', (done) => {
      const item = { bookId: '123', title: 'Book 1', authors: ['author 1'], description: 'First book' };
      actions = new ReplaySubject<Action>(1);
      actions.next(ReadingListActions.finishReadingBooks({ item }));

      effects.finishReadingBook$.subscribe((action) => {
        fail('No actions should be dispatched');
      });
      done();
    });
  });
});