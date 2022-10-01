
const AUDIO = {
    miniExplosion: new URL('mini-explosion.mp3', import.meta.url),
    buttonPress: new URL('button_press.wav', import.meta.url),
} as const;
type Audio = { [name in keyof typeof AUDIO]: ArrayBuffer };

export let GameAudio: Audio | null = null;

export async function loadAudio() {

    // Audio can be downloaded, but not decoded here due to browser restrictions

    GameAudio = (await Promise.all(Object.entries(AUDIO).map(async ([name, url]) => {
            const response = await fetch(url);
            const blob = await response.arrayBuffer();
            return [name, blob] as const;
        })))
        .reduce((all, [name, audio]) => {
            all[name] = audio;
            return all;
        }, {} as Audio);

}

export function playAudio(clip: ArrayBuffer, loop = false) {
    const context = new AudioContext();
    const source = context.createBufferSource();
    source.loop = loop;
    
    context.decodeAudioData(clip.slice(0))
        .then(buffer => {
            source.buffer = buffer;
            source.connect(context.destination);
            source.start();
        })
        .catch(err => {
            console.error('audio clip playback failed');
            console.error(err);
        });
}
