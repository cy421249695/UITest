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
    UIFormType=UIFormType.Normal;
    UIFormShowMode=UIFormShowMode.HideOther;

    public loadingBar:cc.Node=null;
    public loadingBarBackGround:cc.Node=null;
    
    @property
    loadingTime:number=3;

    private loadTimeCount:number=0;
    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         this.loadingBar= this.node.getChildByName("LoadingBarBack").getChildByName("loadingbar");;
         this.loadingBarBackGround= this.node.getChildByName("LoadingBarBack");
     }

    start () {
        cc.tween(this.loadingBar).to(this.loadingTime,{width:this.loadingBarBackGround.width}).start();
        this.scheduleOnce(function()
        {
            UIManager.getInstance().showUIForm("UIPrefabs/LoginPanel");
        },this.loadingTime);
    }

     update (dt) 
     {

     }
}
