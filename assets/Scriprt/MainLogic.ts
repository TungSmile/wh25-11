

import { _decorator, AudioClip, BlockInputEvents, BoxCollider2D, Collider2D, color, Color, Component, Contact2DType, easing, EventTouch, find, game, Graphics, Input, instantiate, IPhysics2DContact, log, logID, Node, PhysicsSystem2D, PolygonCollider2D, Prefab, Size, sp, Sprite, SpriteFrame, TiledMap, TiledMapAsset, tween, UIOpacity, UITransform, v3, Vec2, Vec3, view } from 'cc';
import { DataManager } from './DataManager';
import { PHY_GROUP } from './Phy_Group';
import { Item } from './Item';
import { AdManager } from './AdManager';
import super_html_playable from './super_html_playable';
// import { Responsive2D } from './Responsive2D';
const { ccclass, property } = _decorator;



@ccclass('MainLogic')
export class MainLogic extends Component {
    @property(Node)
    hand: Node = null;
    ads: Node;
    cVas: Node;
    isMove: boolean = true;
    item: Node;
    effHand: any;
    // audio all game
    @property({ type: [AudioClip] })
    sound: AudioClip[] = [];
    // var for img  (useless)
    game: Node;
    @property(TiledMap)
    titledMap: TiledMap = null;
    @property(Node)
    table: Node = null;
    reverse = { oldTile: 0, newTile: 0 };
    level: number = -1;
    done = [2, 3, 4, 8, 9];
    @property(TiledMapAsset)
    tileAsset: TiledMapAsset = null;
    @property(Node)
    pen: Node = null;
    data = [];
    rowsH = 100;
    colsW = 100;
    LayerMain = null;
    // total color
    numberAsset = 10;

    @property(Prefab)
    tick: Prefab = null;

    start() {
        let t = this;
        t.cVas = find('Canvas');
        t.ads = find('Canvas/Ads');
        t.game = find('Canvas/Game');
        t.registerEvent();
        // t.activeHand();
        view.on("canvas-resize", () => {
            t.resize();
        });
        t.resize();
        // t.schedule(() => {
        //     t.checkNextColor()
        // }, 1)
        t.cVas.on(Node.EventType.TOUCH_START, t.firstClick, t)
        t.cVas.on(Input.EventType.MOUSE_WHEEL, t.eventZoom, t)


    }
    firstClick() {
        let t = this;
        t.stopHandTween();
        DataManager.instance.playAudio(t.cVas, t.sound[1], 'loop')
        t.cVas.off(Node.EventType.TOUCH_START, t.firstClick, t)
        t.schedule(() => {
            if (t.isMove) {
                t.LayerMain.updateRenderer();
            }
        }, 0.1)
    }



    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let t = this;

        if (selfCollider.group === PHY_GROUP.Item && otherCollider.group === PHY_GROUP.Guy) {
            let data = otherCollider.node.getComponent(Item).getData();
            t.LayerMain.setTileGIDAt(DataManager.instance.selecterColor, data.col, data.rol);
            otherCollider.group = PHY_GROUP.DEFAULT;
            otherCollider.node.getComponent(Item).destroy();
            otherCollider.node.getComponent(BoxCollider2D).destroy();
            // t.LayerMain.updateRenderer();
        }
    }




    checkNextColor() {
        let t = this;
        // t.done.length <= 2 ? t.unschedule(() => { t.checkNextColor() }) : 0;
        let layer = this.titledMap.getLayer("Tile Layer 1");
        let sizeLayer = layer.getLayerSize();
        let check: boolean = t.level > 0 ? true : false;

        let con1 = t.numberAsset + t.level;
        let con2 = t.numberAsset * 2 + t.level;

        if (con1 && con2) {
            for (let i = 0; i < sizeLayer.width; i++) {
                for (let j = 0; j < sizeLayer.height; j++) {
                    if (layer.getTileGIDAt(i, j) == con1 || layer.getTileGIDAt(i, j) == con2) {
                        check = false;
                    }
                }
            }
            if (check) {
                console.log('done');
                DataManager.instance.countDone++;
                let tickdone = instantiate(t.tick);
                t.table.getChildByPath(t.level.toString()).addChild(tickdone)
                // t.table.getChildByPath(t.level.toString() + "/" + "d").active = true;
                t.done = t.done.filter(e => e != t.level);
                t.level = t.done[0];
                DataManager.instance.playAudio(t.game, t.sound[2], 'noLoop');
                setTimeout(() => { t.eventButton(t.done[0].toString()) }, 400)
            }
        }
    }

    changeTileSet(oldTile: number, newTile: number, isActive: boolean) {
        // let layer = this.titledMap.getLayer("Tile Layer 1");
        let t = this;
        let sizeLayer = t.LayerMain.getLayerSize();
        for (let i = 0; i < sizeLayer.width; i++) {
            for (let j = 0; j < sizeLayer.height; j++) {
                if (t.LayerMain.getTileGIDAt(i, j) == oldTile) {
                    t.LayerMain.setTileGIDAt(newTile, i, j);
                    t.LayerMain.getTiledTileAt(i, j, true).node.getComponent(BoxCollider2D).group = isActive ? PHY_GROUP.Guy : PHY_GROUP.DEFAULT;
                }
            }
        }
        DataManager.instance.playAudio(t.game, t.sound[2], 'noLoop');
        t.LayerMain.updateRenderer();

    }

    buttonChangeColor(e) {
        let t = this;
        t.stopHandTween();
        DataManager.instance.countFail++;
        t.eventButton(e.target.name);

    }



    eventButton(name: string) {
        let t = this;
        let temp = Number(name);
        for (let i = 0; i < t.done.length; i++) {
            if (t.done[i] != temp) {
                t.level = temp;
                break;
            }
        }
        t.table.children.forEach(ele => {
            if (ele.name == name) {
                ele.setScale(v3(1.1, 1.1, 0));
            } else {
                ele.setScale(v3(1, 1, 1))

            }
        })
        if (t.reverse.oldTile != 0 || t.reverse.newTile != 0) {
            t.changeTileSet(t.reverse.newTile, t.reverse.oldTile, false);
        }
        t.reverse.oldTile = t.numberAsset * 2 + temp;
        t.reverse.newTile = t.numberAsset + temp;
        t.changeTileSet(t.reverse.oldTile, t.reverse.newTile, true);
        DataManager.instance.selecterColor = temp;
    }

    registerEvent() {
        let t = this;
        t.getDataCSV();
        t.renderTileMap();
        t.node.on(Node.EventType.TOUCH_START, t.pickItem, t);
        t.node.on(Node.EventType.TOUCH_MOVE, t.moveItem, t);
        t.node.on(Node.EventType.TOUCH_CANCEL, t.dropItem, t);
        t.node.on(Node.EventType.TOUCH_END, t.dropItem, t);
        t.pen.getComponent(BoxCollider2D).on(Contact2DType.BEGIN_CONTACT, t.onBeginContact, t)

    }



    getDataCSV() {
        let t = this;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(t.tileAsset.tmxXmlStr, "text/xml");
        const nameElement = xmlDoc.getElementsByTagName("layer")[0];
        const data = nameElement.textContent;
        let a1 = data.split(',').map(Number);
        for (let i = 0; i < t.rowsH; i++) {
            let temp = a1.slice(i * t.colsW, (i + 1) * t.colsW);
            t.data.push(temp);
        }
    }


    renderTileMap() {
        let t = this;
        if (t.data.length != t.rowsH) {
            return;
        }
        t.LayerMain = t.titledMap.getLayer("Tile Layer 1")
        let tileSize = t.titledMap.getTileSize();
        log(tileSize, "check");
        let white = t.numberAsset * 2

        for (let i = 0; i < (t.colsW - 1); i++) {
            for (let j = 0; j < (t.rowsH - 1); j++) {
                if (t.data[j][i] != 0) {
                    let color = t.data[j][i]
                    switch (t.data[j][i]) {
                        // case 1:
                        // black
                        // break;
                        // case 2:
                        //     // pink1
                        //     break;
                        // case 3:
                        //     // pink2
                        //     break;
                        // case 4:
                        //     // pink3
                        //     break;
                        case 10:
                            // yellow
                            color = 10
                            break;
                        case 8:
                            // black
                            color = 8
                            break;
                        default:
                            // màu cần tô khoảng 5k ô thì ko lag
                            let tiled = t.LayerMain.getTiledTileAt(i, j, true);
                            let newside = tiled.node.addComponent(BoxCollider2D);
                            newside.group = PHY_GROUP.DEFAULT;
                            // newside.size = new Size(tileSize.width, tileSize.height);
                            newside.size = new Size(1, 1);
                            let item = tiled.node.addComponent(Item);
                            item.setData(i, j);
                            color += white;
                            break;
                    }
                    t.LayerMain.setTileGIDAt(color, i, j);
                }
            }
        }
        t.LayerMain.updateRenderer();
    }


    resize() {
        let t = this;
        const screenSize = view.getVisibleSize();
        let width = screenSize.width;
        let height = screenSize.height;
        let ratio = width / height;

        if (width < height) {
            // doc


        } else {
            // this.tableColor.setRotationFromEuler(v3(0, 0, 90))

        }
        log(ratio);
    }

    pickItem(event: EventTouch) {
        let t = this;
        if (t.pen != null && !t.isMove) {
            t.pen.getComponent(BoxCollider2D).group = PHY_GROUP.Item
            const mousePosition = new Vec3(event.getUILocation().x, event.getUILocation().y, 0);
            let localPosition = new Vec3();
            find('Canvas/Game').getComponent(UITransform).convertToNodeSpaceAR(mousePosition, localPosition);
            t.pen.position = localPosition;
            t.isMove = true;

        }
    }

    moveItem(event: EventTouch) {
        let t = this;
        if (t.isMove && t.pen != null) {
            const mousePosition = new Vec3(event.getUILocation().x, event.getUILocation().y, 0);
            let localPosition = new Vec3();
            find('Canvas/Game').getComponent(UITransform).convertToNodeSpaceAR(mousePosition, localPosition);
            t.pen.position = localPosition;
            // console.log('move',localPosition);

        }
    }

    dropItem(event: EventTouch) {
        let t = this;
        t.isMove = false;
        t.pen.getComponent(BoxCollider2D).group = PHY_GROUP.DEFAULT
    }

    update(deltaTime: number) {
        if (DataManager.instance.countDone >= 5
            || DataManager.instance.countFail >= 5
        ) {
            this.ads.active = true
            if (!DataManager.instance.done) {
                DataManager.instance.done = true;
                // DataManager.instance.playAudio(this.node, this.cVas.getComponent(MainLogic).sound[0], 'noLoop');
                this.EventNetWork();
                this.node.getComponent(AdManager).openAdUrl();
            }
        }
    }

    unHintFrist = false;
    activeHand() {
        let t = this;
        let nodeE: Node = find("Canvas/Game/TM/s");
        let nodeS: Node = find('Canvas/Game/table/2');
        let nodeE1: Node = find('Canvas/Game/TM/e');

        let posStart = new Vec3();
        let posEndLocal = new Vec3();
        let posEnd1Local = new Vec3();

        let eWord = new Vec3();
        let e1Word = new Vec3();
        let sWord = new Vec3();

        find('Canvas/Game/table').getComponent(UITransform).convertToWorldSpaceAR(nodeS.position, sWord);
        t.node.getComponent(UITransform).convertToNodeSpaceAR(sWord, posStart);


        find('Canvas/Game/TM').getComponent(UITransform).convertToWorldSpaceAR(nodeE.position, eWord);
        t.node.getComponent(UITransform).convertToNodeSpaceAR(eWord, posEndLocal);

        find('Canvas/Game/TM').getComponent(UITransform).convertToWorldSpaceAR(nodeE1.position, e1Word);
        t.node.getComponent(UITransform).convertToNodeSpaceAR(e1Word, posEnd1Local);

        this.hand.setPosition(posStart.x, posStart.y, posStart.z);

        this.hand.active = t.unHintFrist;
        let eff = tween()
            .by(0.5, { scale: new Vec3(-0.03, -0.03, - 0.03) })
            .by(0.5, { scale: new Vec3(0.03, 0.03, 0.03) })
            .call(() => {
            })
        let eff1 = tween()
            .to(0.5, { position: new Vec3(posEndLocal.x, posEndLocal.y, posEndLocal.z) })
            .call(() => {
            })
        let eff2 = tween()
            .by(0.5, { scale: v3(0.01, 0.01, 1) })
            .call(() => {
                this.hand.active = false;
            })
        let eff3 = tween()
            // .by(0.5, { scale: new Vec3(-0.03, -0.03, - 0.03) })
            // .by(0.5, { scale: new Vec3(0.03, 0.03, 0.03) })
            .to(1.5, { position: new Vec3(posEnd1Local.x, posEnd1Local.y, posEnd1Local.z) })

        this.effHand = tween(this.hand)
            .sequence(
                eff,
                eff1,
                eff3,
                eff2,
                tween().call(() => {
                    t.unHintFrist = true;
                    this.activeHand();
                })
            )
            .start();
    }

    stopHandTween() {
        if (this.effHand) {
            this.effHand.stop();
            this.effHand = null;
            this.hand.active = false;
        }
    }

    EventNetWork() {
        super_html_playable.game_end();

    }






    eventZoom(event) {
        let t = this;
        let scalex = t.game.getChildByPath('ctl/TM').scale.x;
        let temp = (event.getScrollY()) / 10000;
        if (scalex + temp >= 0.2 && scalex + temp <= 1) {
            log(scalex + temp + ":check")
            // if (scalex + temp >= 0.8 && scalex + temp <= 1.2) {
            t.game.getChildByPath('ctl/TM').setScale(v3(scalex + temp, scalex + temp, scalex + temp));
        }
    }

    initialDistance: number = 0;
    initialScale: number = 1;
    initialPosition: Vec3 = new Vec3();
    isZoom: boolean = false;
    touchOne: boolean = false;
    isAnim: boolean = false;

    // event touch move photo
    ETMP(event: EventTouch) {
        let t = this;

        t.touchOne = false;
        const currentPos = new Vec3;
        const mousePosition = new Vec3(event.getUILocation().x, event.getUILocation().y, 0);
        t.node.getChildByName("body").getComponent(UITransform).convertToNodeSpaceAR(mousePosition, currentPos);

        const touches = event.getAllTouches();

        // for event zoom
        if (t.isZoom) {
            const touch1 = touches[0].getLocation();
            const touch2 = touches[1].getLocation();
            const currentDistance = Vec2.distance(touch1, touch2);
            const outOrIn = t.initialDistance < currentDistance ? 1 : -1;
            const scaleChange = (currentDistance / (t.initialDistance * 100)) * outOrIn;
            //  let tempz = t.initialScale / scaleChange
            let tempz = t.initialScale + (scaleChange);
            // log("rate : " + tempz, "r: " + scaleChange)
            if (tempz <= 2 && tempz >= 0.9) {
                t.node.getChildByPath("Game/TM/Tile Layer 1").setScale(new Vec3(tempz, tempz, tempz));
                t.initialScale = tempz;
            }
            return
        }

        // for event pull photo
        // const posX = (currentPos.x - t.initialPosition.x) * LimitFrame.Rate;
        // const posY = (currentPos.y - t.initialPosition.y) * LimitFrame.Rate;
        let rate = Vec3.subtract(new Vec3, currentPos, t.initialPosition);
        t.initialPosition = currentPos
        rate.multiplyScalar(LimitFrame.Rate)
        let origin = t.node.getChildByPath("Game/TM/Tile Layer 1").getPosition(new Vec3);
        let pos = Vec3.add(new Vec3, origin, rate);
        if (pos.x > LimitFrame.x * (t.initialScale * t.initialScale)) {
            pos.x = LimitFrame.x * (t.initialScale * t.initialScale)
        }
        if (pos.x < -LimitFrame.x * (t.initialScale * t.initialScale)) {
            pos.x = -LimitFrame.x * (t.initialScale * t.initialScale)
        }
        if (pos.y < -LimitFrame.y * (t.initialScale * t.initialScale)) {
            pos.y = -LimitFrame.y * (t.initialScale * t.initialScale)
        }
        if (pos.y > LimitFrame.y * (t.initialScale * t.initialScale)) {
            pos.y = LimitFrame.y * (t.initialScale * t.initialScale)
        }
        t.node.getChildByPath("Game/TM/Tile Layer 1").setPosition(pos);

    }

    // event touch start photo
    ETSP(event: EventTouch) {
        let t = this;
        if (t.isAnim) {
            return
        }
        t.touchOne = true;

        const touches = event.getAllTouches();
        // event zoom
        if (touches.length >= 2) {
            const touch1 = touches[0].getLocation();
            const touch2 = touches[1].getLocation();
            t.initialDistance = Vec2.distance(touch1, touch2);
            t.isZoom = true;
            // t.initialScale = t.CamMain.node.position.z
            t.touchOne = false;
            return;
        }

        const mousePosition = new Vec3(event.getUILocation().x, event.getUILocation().y, 0);
        // let localPosition = new Vec3();
        t.node.getChildByName("body").getComponent(UITransform).convertToNodeSpaceAR(mousePosition, t.initialPosition);
        // t.initialPosition = new Vec3(event.getLocation().x, event.getLocation().y, 0)




        // const collider = PhysicsSystem2D.instance.testPoint(event.getUILocation());

        // // select correct itemsd
        // if (collider.length > 0) {
        //     // no muti layer coliider
        //     let idItem = Number(collider[collider.length - 1].node.name);
        //     let itemTemp = collider[collider.length - 1].node
        //     // t.node.getChildByPath("body/img/" + collider[collider.length - 1].node.name);

        //     if (itemTemp.getComponent(item)) {
        //         itemTemp.getComponent(item).EWCCI(Condition.TimeAnimCorrect, 0);
        //         t.ATDTPNTT(idItem);
        //         t.isSelectItem = true;
        //         t.isAnim = true;
        //     }

        // }

    }

    // event end hold image
    EEHI(event: EventTouch) {
        let t = this;
        // if (t.touchOne && !t.isSelectItem && !t.isAnim && !t.isZoom) {
        //     t.isAnim = true;
        //     t.ERH();
        //     t.WSXSWW()
        // }
        t.touchOne = false;
        // t.point.active = true;
        // t.isSelectItem = false;
        t.isZoom = false;
    }


    addEventZoomAndMovePhoto() {
        let t = this;
        t.node.getChildByPath("Game/TM").on(Node.EventType.TOUCH_START, t.ETSP, t);
        t.node.getChildByPath("Game/TM").on(Node.EventType.TOUCH_MOVE, t.ETMP, t);
    }


}


export enum LimitFrame {
    x = 190,
    y = 110, // 110
    z = 0,
    Rate = 0.75 //
}