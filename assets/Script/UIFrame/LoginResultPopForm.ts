// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import { BaseUIForm } from "./BaseUiForm";
import { UIFormShowMode, UIFormType } from "./Config/SysDefine";
import UIManager from "./UIManager";

@ccclass
export default class LoginResultPopForm extends BaseUIForm {

    UIFormType = UIFormType.PopUp;
    UIFormShowMode = UIFormShowMode.ReverseChange;

    @property(cc.Label)
    UserName: cc.Label = null;

    @property(cc.Label)
    Passport: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:
    private CloseNode: cc.Button = null;

    onLoad() {
        this.CloseNode = this.node.getChildByName("CloseButton").getComponent(cc.Button);
        this.UserName = this.node.getChildByName("User").getComponent(cc.Label);
        this.Passport = this.node.getChildByName("Passport").getComponent(cc.Label);
    }

    public init(obj?: any) {
        if (obj != null) {
            this.setData(obj[0] as string, obj[1] as string);
        }
    }

    start() {
        this.CloseNode.node.on('click', function () {
            UIManager.getInstance().closeUIForm("UIPrefabs/LoginResultPop");
        }, this);

    }

    public setData(user: string, passport: string) {
        this.UserName.string = "用户名：" + user;
        this.Passport.string = "密码：" + passport;
    }
    // update (dt) {}
}
