import { _decorator, AudioClip, Component, Node, TiledMap, TiledMapAsset } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Ctl')
export class Ctl extends Component {

    @property(TiledMap)
    titledMap: TiledMap = null;
    @property(TiledMapAsset)
    tileAsset: TiledMapAsset = null;
    @property(Node)
    table: Node = null;
    @property(Node)
    pen: Node = null;
    @property({ type: [AudioClip] })
    sound: AudioClip[] = [];

    start() {

    }


    setupTileMap() {
        let t = this;
    }



    



    update(deltaTime: number) {

    }
}

