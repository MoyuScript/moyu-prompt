import { TeleprompterConfig } from "@/components/Teleprompter";
import { DEFAULT_CONFIG, STORAGE_KEY } from "@/const";
import * as storage from '@/utils/localStorage';

export function configUseState(): Required<TeleprompterConfig> {
  const config = storage.get<TeleprompterConfig>(STORAGE_KEY.config);

    if (!config) {
      return DEFAULT_CONFIG;
    }

    return {...DEFAULT_CONFIG, ...config};
}
