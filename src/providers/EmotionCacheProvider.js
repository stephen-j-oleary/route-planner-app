import { CacheProvider } from "@emotion/react";

import createEmotionCache from "@/utils/createEmotionCache";


const defaultEmotionCache = createEmotionCache();

export default function EmotionCacheProvider({
  emotionCache = defaultEmotionCache,
  ...props
}) {
  return (
    <CacheProvider
      value={emotionCache}
      {...props}
    />
  );
}