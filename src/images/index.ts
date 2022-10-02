
const IMAGES = {
    // These URLs must not be variablised so that parcel will pull them in
    'dog': new URL('dog.png?width=100&height=100', import.meta.url),
    'man': new URL('man.png?width=50&height=50', import.meta.url),
    'explosion': new URL('explosion.png?width=252&height=42', import.meta.url),
} as const;
type Images = { [name in keyof typeof IMAGES]: ImageBitmap };

const LAZY_IMAGES = {
    'level01_bounds': new URL('levels/01/bounds.png?width=1000&height=1000', import.meta.url),
    'level01_map': new URL('levels/01/map.png?width=1000&height=1000', import.meta.url),

    'level02_bounds': new URL('levels/02/bounds.png?width=1024&height=1024', import.meta.url),
    'level02_map': new URL('levels/02/map.png?width=1024&height=1024', import.meta.url),
} as const;
type LazyImages = { [name in keyof typeof LAZY_IMAGES]: () => Promise<ImageBitmap> };

async function downloadImage(url: URL) {
    const response = await fetch(url);
    const blob = await response.blob();
    return await createImageBitmap(blob);
}

export let GameImage: Images | null = null;

export async function loadImages() {

    GameImage = (await Promise.all(Object.entries(IMAGES).map(async ([name, url]) => 
            [name, await downloadImage(url)] as const
        )))
        .reduce((all, [name, image]) => {
            all[name] = image;
            return all;
        }, {} as Images);

    console.log(GameImage);
}


export let LazyGameImage = Object.entries(LAZY_IMAGES).reduce((all, [k, url]) => {
    all[k] = () => downloadImage(url);
    return all;
}, {} as LazyImages);

