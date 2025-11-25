import { _decorator, CCBoolean, CCInteger, Collider2D, Component, Contact2DType, IPhysics2DContact, log, Node, PolygonCollider2D, SpriteFrame, TiledLayer, Vec3 } from 'cc';
import { PHY_GROUP } from './Phy_Group';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

@ccclass('Item')
export class Item extends Component {
    // private initialPostion: Vec3;
    check: boolean = false;
    other: Node;
    // collide: Collider2D = null;
    data = { col: 0, rol: 0 };

    start() {
        let t = this;
        // t.initialPostion = new Vec3(this.node.position.x, this.node.position.y, 0);
        //set index for display layer
        // t.collide = t.getComponent(Collider2D);
        // t.collide.on(Contact2DType.BEGIN_CONTACT, t.onBeginContact, t);
        // t.collide.on(Contact2DType.END_CONTACT, t.onEndContact, t);
        // t.collide.on(Contact2DType.PRE_SOLVE, t.onPreSolve, t);

    }

    setData(coll: number, row: number) {
        let t = this;
        t.data.col = coll;
        t.data.rol = row;
    }
    getData() {
        return this.data
    }



    // backPosition() {
    //     let t = this;
    //     t.node.position = t.initialPostion;

    // }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let t = this;
        // console.log(contact.colliderA, contact.colliderB, contact.disabled);
        //  set group for collider
        // if (selfCollider.group === PHY_GROUP.Item && otherCollider.group === PHY_GROUP.Guy) {
        //     t.other = otherCollider.node;
        //     setTimeout(() => {
        //         // console.log("vao" + otherCollider.node.name);
        //         t.check = true;
        //     }, 10)
        // if (selfCollider.group === PHY_GROUP.Item && otherCollider.group === PHY_GROUP.Guy) {
        //     t.layer.setTileGIDAt(DataManager.instance.selecterColor, t.data.col, t.data.rol);
        //     t.collide.group = PHY_GROUP.DEFAULT;
        //     t.layer.updateRenderer();

        // }
        // }
    }



    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let t = this;
        // t.check = false;



    }



    update(deltaTime: number) {

    }
}

