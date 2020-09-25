// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import { UIFormType,UIFormShowMode } from "./Config/SysDefine";

const { ccclass, property } = cc._decorator;

@ccclass
export class BaseUIForm extends cc.Component {

    @property
    public UIFormName: string="";

    public UIFormType = UIFormType.Normal;

    public UIFormShowMode=UIFormShowMode.Normal;

    public CloseAndDestory = false;

    public init(obj?: any) {

     }

    start() {

    }

/*     显示
 */    public display(){
        this.node.active=true;
    }

/*     隐藏
 */    public hide(){
        this.node.active=false;
    }
    // update (dt) {}
}
