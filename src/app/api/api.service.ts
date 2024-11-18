import { Injectable, signal } from '@angular/core'
import { Book, ErrorSettings } from '../interfaces/data-interfaces'
import { booksMock } from './api-service-mocks'
import { wait } from '../utils/utils'


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  errorSettings: ErrorSettings = {
    get: false,
    delete: false,
    post: false,
    put: false,
  }

  private bookListSignal = signal<Book[]>([])
  private getErrorSignal = signal<boolean>(false)
  private deleteErrorSignal = signal<boolean>(false)
  private postErrorSignal = signal<boolean>(false)
  private putErrorSignal = signal<boolean>(false)

  bookList = this.bookListSignal.asReadonly()
  getError = this.getErrorSignal.asReadonly()
  deleteError = this.deleteErrorSignal.asReadonly()
  postError = this.postErrorSignal.asReadonly();
  putError = this.putErrorSignal.asReadonly()

  async getBookList(filter = ''): Promise<void> {
    this.getErrorSignal.set(false)
    await wait(2000)
    if (this.errorSettings.get) {
      this.getErrorSignal.set(true)
    } else {
      const normalizedFilter = filter.trim().toLowerCase()
      const filteredBooks = booksMock.filter(book =>
        book.title.toLowerCase().includes(normalizedFilter) ||
        book.author.toLowerCase().includes(normalizedFilter)
      );
      this.bookListSignal.set(filteredBooks);
    }
  }

  async updateBook(bookId: string, updatedData: Partial<Book>): Promise<void> {
    this.putErrorSignal.set(false);
    await wait(2000);
    if (this.errorSettings.put) {
      this.putErrorSignal.set(true);
    } else {
      const currentList = this.bookListSignal();
      const updatedList = currentList.map(book =>
        book.id === bookId ? { ...book, ...updatedData } : book
      );
      this.bookListSignal.set(updatedList);
    }
  }

  async createBook(bookData: Partial<Book>): Promise<void> {
    this.postErrorSignal.set(false);
    await wait(2000);
    if (this.errorSettings.post) {
      this.postErrorSignal.set(true);
    } else {
      const currentList = this.bookListSignal();
      const newBook: Book = {
        id: this.generateUniqueId(),
        avatar_url: bookData.avatar_url ?? '',
        title: bookData.title ?? '',
        author: bookData.author ?? '',
        createdDate: bookData.createdDate ? new Date(bookData.createdDate) : new Date(),
        description: bookData.description ?? '',
      };
      this.bookListSignal.set([...currentList, newBook]);
    }
  }

  async deleteBook(bookId: string): Promise<void> {
    this.deleteErrorSignal.set(false)
    await wait(2000)
    const currentList = this.bookListSignal()
    const updatedList = currentList.filter(book => book.id !== bookId);
    if (this.errorSettings.delete) {
      this.deleteErrorSignal.set(true)
    } else {
      this.bookListSignal.set(updatedList)
    }
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
