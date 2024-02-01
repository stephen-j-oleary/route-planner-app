import { CacheProvider, EmotionCache } from "@emotion/react";
import React from "react";

import createEmotionCache from "@/utils/createEmotionCache";


const defaultEmotionCache = createEmotionCache();

export type EmotionCacheProviderProps = {
  emotionCache?: EmotionCache,
  children: React.ReactNode,
};

export default function EmotionCacheProvider({
  emotionCache = defaultEmotionCache,
  ...props
}: EmotionCacheProviderProps) {
  return (
    <CacheProvider
      value={emotionCache}
      {...props}
    />
  );
}