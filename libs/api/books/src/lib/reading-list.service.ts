import { Injectable } from '@nestjs/common';
import { StorageService } from '@tmo/shared/storage';
import { Book, ReadingListItem } from '@tmo/shared/models';

const KEY = '[okreads API] Reading List';

@Injectable()
export class ReadingListService {
  private readonly storage = new StorageService<ReadingListItem[]>(KEY, []);

  async getList(): Promise<ReadingListItem[]> {
    const readingList = this.storage.read();
    return readingList;
  }

  async addBook(b: Book): Promise<void> {
    this.storage.update(list => {
      const { id, ...rest } = b;
      list.push({
        bookId: id,
        ...rest
      });
      return list;
    });
  }

  async removeBook(id: string): Promise<void> {
    this.storage.update(list => {
      return list.filter(x => x.bookId !== id);
    });
  }

  async finishedBook(id: string): Promise<ReadingListItem | undefined> {
    const currentDate = new Date().toISOString();
    let updatedItem: ReadingListItem | undefined;
    this.storage.update((list) => {
      return list.map((x) => {
        if (x.bookId === id) {
          const finishedList = { ...x, finished: true, finishedDate: currentDate };
          updatedItem = finishedList;
          return finishedList;
        }
        return x;
      });
    });
    return updatedItem;
  }
}