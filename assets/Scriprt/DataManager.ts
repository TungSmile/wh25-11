import { _decorator, AudioClip, AudioSource, Component, error, ImageAsset, Node, resources, SpriteFrame, Texture2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Component {
    private static _instance: any = null;
    static getInstance<T>(): T {
        if (this._instance === null) {
            this._instance = new this()
        }
        return this._instance
    }

    static get instance() {
        return this.getInstance<DataManager>()
    }
    countDone: number = 0;
    countFail: number = 0;
    done: boolean = false;
    eff: any;

    selecterColor: number = 0;
    // whiteNumber: number = 12;
    // fillNumber: number = 11;


    

    playAudio(node: Node, audio: AudioClip, loop: string, vol: number = 1) {
        let audioSource = node.getComponent(AudioSource);
        if (!audioSource) {
            audioSource = node.addComponent(AudioSource);
        }
        audioSource.clip = audio;
        audioSource.volume = vol;
        if (loop && loop === 'loop') {
            audioSource.node.on(AudioSource.EventType.ENDED, () => {
                audioSource.play();
            }, this)
        }
        if (audioSource) {
            audioSource.play();
        }
    }

}

