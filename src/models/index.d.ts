import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Book {
  readonly id: string;
  readonly bookId?: string;
  readonly name: string;
  readonly category: string;
  readonly description?: string;
  readonly price: number;
  constructor(init: ModelInit<Book>);
  static copyOf(source: Book, mutator: (draft: MutableModel<Book>) => MutableModel<Book> | void): Book;
}