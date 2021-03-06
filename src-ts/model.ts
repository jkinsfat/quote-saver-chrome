import { Quote } from "./quote";

export interface iModel {
    put(item: any, callback?: () => void): void;
    removeFirstWithValueAt(value: any, key: string, callback?: () => void ): void;
    getAll(callback: (items: Array<any>) => void): void;
    reset(): void;
}

export class QuoteModel implements iModel {
    constructor(private store: chrome.storage.StorageArea) {}

    put(item: Quote, callback?: () => void): void {
        if (item) {
            this.store.get((storage): void => {
                if(storage.hasOwnProperty('quotes')) {
                    storage.quotes.push(item);
                } else {
                    storage['quotes'] = [item];
                }
                this.store.set(storage, callback);
            });
        }
    }
    
    removeFirstWithValueAt(value: any, key: string, callback: ((removedValue: Quote | null) => void) | undefined): void {
        this.store.get((storage): void => {
            let removedDatum: Quote | null = null;
            if(storage.hasOwnProperty('quotes')) {
                for (let quoteIndex in storage.quotes) {
                    if (storage.quotes[quoteIndex][key] === value) {
                        removedDatum = storage.quotes[quoteIndex]
                        storage.quotes.splice(quoteIndex, 1);
                        this.store.set(storage);
                    } 
                }
            } 
            if (callback) {
                callback(removedDatum);
            }       
        });
    }

    getAll(callback: (items: Array<Quote>) => void): void {
        this.store.get(function(storage): void {
            if(storage.hasOwnProperty('quotes')) {
                callback(storage.quotes);
            } else {
                callback([]);
            }
        });
    }

    reset(): void {
        this.store.set({'quotes': []});
    }
}