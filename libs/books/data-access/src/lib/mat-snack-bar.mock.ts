/// <reference types="jasmine" />
import { Subject } from 'rxjs';
export class MatSnackBarMock {
    open: jasmine.Spy<jasmine.Func> = jasmine.createSpy('open').and.returnValue({
        onAction: new Subject().asObservable(),
    });

    onActionSubject: Subject<void> = new Subject<void>();
    onAction: jasmine.Spy<jasmine.Func> = jasmine
        .createSpy('onAction')
        .and.callFake((callback: () => void) => {
            this.onActionSubject.subscribe(callback);
        });
}