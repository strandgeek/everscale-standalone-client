import type * as nt from 'nekoton-wasm';
import init, * as nekoton from 'nekoton-wasm';

const core = {
  ensureNekotonLoaded: undefined as unknown,
  nekoton: undefined as unknown, // will be initialized during start
  fetch: undefined as unknown,
  fetchAgent: () => undefined,
  debugLog: undefined as unknown,
} as {
  ensureNekotonLoaded: (initInput?: nt.InitInput | Promise<nt.InitInput>) => Promise<void>,
  nekoton: typeof nt,
  fetch: typeof fetch,
  fetchAgent: (url: string) => any,
  debugLog: (...data: any[]) => void,
};

let clientInitializationStarted = false;
let notifyClientInitialized: { resolve: () => void; reject: () => void };
const initializationPromise: Promise<void> = new Promise<void>((resolve, reject) => {
  notifyClientInitialized = { resolve, reject };
});

core.ensureNekotonLoaded = (initInput?: nt.InitInput | Promise<nt.InitInput>): Promise<void> => {
  if (!clientInitializationStarted) {
    clientInitializationStarted = true;
    init(initInput).then(notifyClientInitialized.resolve).catch(notifyClientInitialized.reject);
  }
  return initializationPromise;
};
core.nekoton = nekoton;
core.fetch = fetch;
core.debugLog = _nothing => {
  /* do nothing */
};

export default core;
