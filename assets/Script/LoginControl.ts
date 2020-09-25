// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export  class LoginControl extends cc.Component {

    @property(cc.Node )
    LoginPanel: cc.Node = null;

    @property(cc.Node )
    LoadingPanel: cc.Node  = null;

    @property(cc.Node )
    LoginResult: cc.Node  = null;

    @property
    LoadingTime:number = 3;
    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.LoginPanel.active=false;
        this.LoadingPanel.active=true;
        this.LoginResult.active=false;
     }

    start () {
        this.DelayLoading();
    }

    OpenPanel(panels:[cc.Node])
    {
        if(this.LoginPanel.activeInHierarchy)
        {
            this.LoginPanel.active=false;
        }
        if(this.LoadingPanel.activeInHierarchy)
        {
            this.LoadingPanel.active=false;
        }
        if(this.LoginResult.activeInHierarchy)
        {
            this.LoginResult.active=false;
        }
        for(let i=0;i<panels.length;i++)
        {
            panels[i].active=true;
        }
    }

     DelayLoading(){
        this.scheduleOnce(function name() {
            this.OpenPanel(new Array(this.LoginPanel));
        },this.LoadingTime)
    } 
    // update (dt) {}
}
