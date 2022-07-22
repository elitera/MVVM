import type Binder from '../binder';

interface Options {
  methods?: {
    [key: string]: Function;
  };
}

export interface ViewModelSource {
  data: Record<string, any>;
  options?: Options;
}

export default class ViewModel {
  private _data: ViewModelSource['data'];
  private _options?: Options;

  private _listeners: Binder[];

  constructor(props: ViewModelSource) {
    this._data = this.getProxy(props.data);
    this._options = props.options;

    this._listeners = [];
  }

  public get data() {
    return this._data;
  }

  public get options() {
    return this._options;
  }

  public setData(newData: ViewModelSource['data']) {
    Object.keys(newData).forEach(key => {
      this._data[key] = newData[key];
    });
  }

  public subscribe(binder: Binder) {
    if (this._listeners.includes(binder)) {
      return;
    }

    this._listeners.push(binder);
  }

  public unsubscribe(binder: Binder) {
    this._listeners = this._listeners.filter(
      _binder => binder !== _binder
    );
  }

  public notify(viewModel: ViewModel) {
    this._listeners.forEach(listener => {
      listener.update(viewModel);
    });
  }

  private getProxy(data: ViewModelSource['data']) {
    const handler = {
      set: (obj, key, value) => {
        obj[key] = value;
        this.notify(this);

        return true;
      }
    };

    const proxyObj = new Proxy(data, handler);

    Object.seal(proxyObj);

    return proxyObj;
  }
}
