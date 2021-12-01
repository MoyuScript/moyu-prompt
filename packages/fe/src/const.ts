import { TeleprompterConfig } from "./components/Teleprompter";

export const CONFIG_RANGE  = {
  // min, max, default
  fontSize: [16, 128, 64],
  speed: [1, 128, 50]
}

export const DEFAULT_CONFIG: Required<TeleprompterConfig> = {
  fontSize: 64,
  speed: 50,
  mirror: false,
  showProgress: true,
  showMask: true
};

export const STORAGE_KEY = {
  config: 'config'
}
