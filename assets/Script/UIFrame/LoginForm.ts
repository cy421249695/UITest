// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { BaseUIForm } from "./BaseUiForm";
import { UIFormShowMode, UIFormType } from "./Config/SysDefine";
import UIManager from "./UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginForm extends BaseUIForm {

    uiFormType: UIFormType = UIFormType.Normal;
    uiShowType: UIFormShowMode = UIFormShowMode.HideOther;

    private UserEditorBox: cc.EditBox = null;

    private PassportEditorBox: cc.EditBox = null;

    private LoginBtn: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.UserEditorBox = this.node.getChildByName("UserEditBox").getComponent(cc.EditBox);
        this.PassportEditorBox = this.node.getChildByName("PassportEditBox").getComponent(cc.EditBox);
        this.LoginBtn = this.node.getChildByName("LoginButton").getComponent(cc.Button);
    }

    start() {   
        this.LoginBtn.node.on('click', () => {
            let strings = [this.UserEditorBox.string, this.PassportEditorBox.string];
            UIManager.getInstance().showUIForm("UIPrefabs/LoginResultPop", strings);
        }, this);
    }
    // update (dt) {}
}
