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

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadingForm extends BaseUIForm{
    private uiFormType:UIFormType=UIFormType.Normal;
    private uiShowMode:UIFormShowMode=UIFormShowMode.HideOther;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.scheduleOnce(function()
        {
            UIManager.getInstance().showUIForm("UIPrefabs/LoginPanel");
        },3);
    }

    // update (dt) {}
}
