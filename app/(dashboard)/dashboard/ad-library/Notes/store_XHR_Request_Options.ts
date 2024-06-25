// @/lib/store_XHR_Request_Options.ts
interface Store_XHR_Request_Options {
  options: any | null;
  setOptions: (options: any) => void;
  getOptions: () => any | null;
}

const store_XHR_Request_Options: Store_XHR_Request_Options = {
  options: null,
  setOptions(options) {
    console.log(
      "🚀 ~ file: store_XHR_Request_Options.ts:store_XHR_Request_Options.setOptions ~ options:",
    );
    this.options = options;
  },
  getOptions() {
    console.log(
      "🚀 ~ file: store_XHR_Request_Options.ts:store_XHR_Request_Options.getOptions ~ this.options:",
    );

    return this.options;
  },
};

export default store_XHR_Request_Options;
