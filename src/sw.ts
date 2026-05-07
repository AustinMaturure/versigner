/// <reference lib="webworker" />

import {
  precacheAndRoute,
  cleanupOutdatedCaches,
} from 'workbox-precaching'
import type { PrecacheEntry } from 'workbox-precaching'

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: (PrecacheEntry | string)[]
}

precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()
