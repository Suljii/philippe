import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

export const sanityClient = createClient({
    projectId: 'kqibhc66',
    dataset: 'production',
    apiVersion: '2026-05-12',
})

const builder = createImageUrlBuilder(sanityClient)
export function urlFor(source: any) {
  return builder.image(source)
}