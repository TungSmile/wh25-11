import { _decorator, AudioClip, Component, log, Node, TiledMap, TiledMapAsset } from 'cc';
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

    dataTemp = null;
    LayerMain = null;

    start() {
        let t = this;

    }











    setupTileMap() {
        let t = this;
        t.GRDBT();
        t.RT();

    }

    // getRawDataByTilemap
    GRDBT() {
        let t = this;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(t.tileAsset.tmxXmlStr, "text/xml");
        const nameElement = xmlDoc.getElementsByTagName("layer")[0];
        const data = nameElement.textContent;
        let height = Number.parseInt(nameElement.getAttribute("height"));
        let width = Number.parseInt(nameElement.getAttribute("width"));
        // let a1 = data.split(',').map(Number);
        t.dataTemp = data.split(',').map(Number);
        // log(a1[5]);
        // for (let i = 0; i < height; i++) {
        //     let temp = a1.slice(i * width, (i + 1) * width);
        //     t.data.push(temp);
        // }
    }

    // render tilemap
    RT() {
        let t = this;
        if (t.dataTemp.length == 0) {
            log("no data raw")
            return;
        }
        t.LayerMain = t.titledMap.getLayer("Tile Layer 1")
        let tileSize = t.titledMap.getTileSize();
        log(tileSize, "check");

    }









    update(deltaTime: number) {

    }
}

