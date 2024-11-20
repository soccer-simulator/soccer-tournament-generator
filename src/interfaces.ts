export interface StoreInterface {
  init(): Promise<void>;
  dispose(): Promise<void>;
}
