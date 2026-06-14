import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

export const sanityClient = createClient({
    projectId: 'kqibhc66',
    dataset: 'production',
    apiVersion: '2026-05-12',
    useCdn: true,
})

const builder = createImageUrlBuilder(sanityClient)
export function urlFor(source: any) {
  return builder.image(source)
}

type ImgOpts = { square?: boolean; quality?: number }

// URL d'une image à une largeur donnée (carré recadré ou format libre borné).
export function imgSrc(source: any, w: number, { square = false, quality = 82 }: ImgOpts = {}) {
  let b = urlFor(source).width(w)
  b = square ? b.height(w).fit('crop') : b.fit('max')
  return b.auto('format').quality(quality).url()
}

// srcset multi-largeurs pour le responsive (le navigateur choisit selon l'écran).
export function imgSrcSet(source: any, widths: number[], opts: ImgOpts = {}) {
  return widths.map((w) => `${imgSrc(source, w, opts)} ${w}w`).join(', ')
}
