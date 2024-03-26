export default class LocalStorage {
  key: string;

  constructor(key: string) {
    this.key = key;
  }

  getItems() {
    return window.localStorage.getItem(this.key) || ''
  }

  setItems(value: any) {
    window.localStorage.setItem(this.key, value);
  }

  removeItem() {
    window.localStorage.removeItem(this.key);
  }
}
