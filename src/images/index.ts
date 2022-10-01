
const IMAGES = {
    // These URLs must not be variablised so that parcel will pull them in
    'dog': new URL('dog.png?width=100&height=100', import.meta.url),
    'man': new URL('man.png?width=50&height=50', import.meta.url),
    'explosion': new URL('explosion.png?width=252&height=42', import.meta.url),



    'level01_bounds': new URL('levels/01/bounds.png?width=1000&height=1000', import.meta.url),
    'level01_map': new URL('levels/01/map.png?width=1000&height=1000', import.meta.url),

} as const;
type Images = { [name in keyof typeof IMAGES]: ImageBitmap };

export let GameImage: Images | null = null;

export async function loadImages() {

    GameImage = (await Promise.all(Object.entries(IMAGES).map(async ([name, url]) => {
            const response = await fetch(url);
            const blob = await response.blob();
            return [name, await createImageBitmap(blob)] as const;
        })))
        .reduce((all, [name, image]) => {
            all[name] = image;
            return all;
        }, {} as Images);

}

