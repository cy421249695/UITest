// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { SysDefine, UIFormShowMode, UIFormType } from "./Config/SysDefine";
import { BaseUIForm } from "./BaseUiForm";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {

    private _NoNormal: cc.Node = null;                              // 全屏显示的UI 挂载结点
    private _NoFixed: cc.Node = null;                               // 固定显示的UI
    private _NoPopUp: cc.Node = null;                               // 弹出窗口
    private _NoIndependent: cc.Node = null;                         // 独立窗体

    private _StaCurrentUIForms: Array<BaseUIForm> = [];                     // 存储反向切换的窗体
    private _MapAllUIForms: { [key: string]: BaseUIForm } = {};              // 所有的窗体
    private _MapCurrentShowUIForms: { [key: string]: BaseUIForm } = {};      // 正在显示的窗体(不包括弹窗)
    private _MapIndependentForms: { [key: string]: BaseUIForm } = {};      // 独立窗体 独立于其他窗体, 不受其他窗体的影响 

    private static _Instance: UIManager = null;

    public static getInstance(): UIManager {

        if (this._Instance == null) {
            this._Instance = cc.find(SysDefine.SYS_UIROOT_NAME).addComponent<UIManager>(this);
        }
        return this._Instance;
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._NoNormal = this.node.getChildByName(SysDefine.SYS_NORMAL_NODE);
        this._NoFixed = this.node.getChildByName(SysDefine.SYS_FIXED_NODE);
        this._NoPopUp = this.node.getChildByName(SysDefine.SYS_POPUP_NODE);
        this._NoIndependent = this.node.getChildByName(SysDefine.SYS_INDEPENDENT_NODE);
    }

    start() {

    }


    public checkUIFormIsShowing(uiFormName: string) {
        let baseUIForms = this._MapAllUIForms[uiFormName];

        if (baseUIForms == null) {
            return false;
        }
        return baseUIForms.node.active;
    }

    public async showUIForm(uiFormName: string,obj?:any) {
        if (uiFormName === "" || uiFormName == null) return;
        if (this.checkUIFormIsShowing(uiFormName)) {
            cc.log(`${uiFormName}窗体已经在显示`);
            return;
        }
        let baseUIForms = await this.loadFormsToAllUIFormsCatch(uiFormName);
        if (baseUIForms == null) {
            cc.log(`${uiFormName}可能正在加载中`);
            return;
        }
        // 初始化窗体名称
        baseUIForms.UIFormName = uiFormName;

        switch (baseUIForms.UIFormShowMode) {
            case UIFormShowMode.Normal:                             // 普通模式显示
                this.loadNormal(uiFormName,obj);
                break;
            case UIFormShowMode.ReverseChange:                      // 反向切换
                this.pushUIFormToStack(uiFormName,obj);
                break;
            case UIFormShowMode.HideOther:                          // 隐藏其他
                this.enterUIFormsAndHideOther(uiFormName,obj);
                break;
            case UIFormShowMode.Independent:                        // 独立显示
                this.loadUIFormsToIndependent(uiFormName,obj);
                break;
        }
    }

    public closeUIForm(uiFormName: string) {
        if (uiFormName == "" || uiFormName == null) return;
        let baseUIForm = this._MapAllUIForms[uiFormName];

        if (baseUIForm == null) return;

        switch (baseUIForm.UIFormShowMode) {
            case UIFormShowMode.Normal:                             // 普通模式显示
                this.exitUIForms(uiFormName);
                break;
            case UIFormShowMode.ReverseChange:                      // 反向切换
                this.popUIForm();
                break;
            case UIFormShowMode.HideOther:                          // 隐藏其他
                this.exitUIFormsAndDisplayOther(uiFormName);
                break;
            case UIFormShowMode.Independent:
                this.exitIndependentForms(uiFormName);
                break;
        }
        // 判断是否销毁该窗体
        if (baseUIForm.CloseAndDestory) {
            this.destoryForm(baseUIForm, uiFormName);
        }
    }


    private loadNormal(uiFormName: string,obj?:any) {
        let baseUIForm: BaseUIForm = null;
        let baseUIFormFromAllCache: BaseUIForm = null;

        baseUIForm = this._MapCurrentShowUIForms[uiFormName];
        if (baseUIForm != null) return;                                     // 要加载的窗口正在显示

        baseUIFormFromAllCache = this._MapAllUIForms[uiFormName];
        if (baseUIFormFromAllCache != null) {
            this._MapCurrentShowUIForms[uiFormName] = baseUIFormFromAllCache;
            baseUIFormFromAllCache.display();
            baseUIFormFromAllCache.init(obj);
        }
    }

    private loadUIFormsToIndependent(uiFormName: string,obj?:any) {
        let baseUIForm = this._MapAllUIForms[uiFormName];
        if (baseUIForm == null) return;

        this._MapIndependentForms[uiFormName] = baseUIForm;
        baseUIForm.display();
        baseUIForm.init(obj);
    }

    /**
 * 从全部的UI窗口中加载, 并挂载到结点上
 */
    private async loadFormsToAllUIFormsCatch(uiFormName: string) {
        let baseUIResult = this._MapAllUIForms[uiFormName];
        if (baseUIResult == null) {
            baseUIResult = await this.loadUIForm(uiFormName);
        }
        return baseUIResult;
    }

    /**
      * 加载到栈中
      * @param uiFormName 
      */
    private pushUIFormToStack(uiFormName: string,obj?:any) {

        let baseUIForm = this._MapAllUIForms[uiFormName];
        if (baseUIForm == null) return;

        // 加入栈中, 同时设置其zIndex 使得后进入的窗体总是显示在上面
        this._StaCurrentUIForms.push(baseUIForm);
        baseUIForm.node.zIndex = this._StaCurrentUIForms.length;
        baseUIForm.display();
        baseUIForm.init(obj);
    }

    private async loadUIForm(strUIFormPath: string,objs?:any) {
        if (strUIFormPath == "" || strUIFormPath == null) {
            return null;
        }

        let obj: any = await this.loadRes(strUIFormPath, cc.Prefab);

        let node: cc.Node = cc.instantiate(obj);

        let baseUIForm = node.getComponent(BaseUIForm);
        if (baseUIForm == null) {
            return null;
        }
        baseUIForm.init(objs);
        node.active = false;
        switch (baseUIForm.UIFormType) {
            case UIFormType.Normal:
                UIManager.getInstance()._NoNormal.addChild(node);
                break;
            case UIFormType.Fixed:
                UIManager.getInstance()._NoFixed.addChild(node);
                break;
            case UIFormType.PopUp:
                UIManager.getInstance()._NoPopUp.addChild(node);
                break;
            case UIFormType.Independent:
                UIManager.getInstance()._NoIndependent.addChild(node);
                break;
        }
        this._MapAllUIForms[strUIFormPath] = baseUIForm;

        return baseUIForm;
    }



    private destoryForm(baseUIForm: BaseUIForm, uiFormName: string) {
        baseUIForm.node.destroy();
        // 从allmap中删除
        this._MapAllUIForms[uiFormName] = null;
        delete this._MapAllUIForms[uiFormName];
    }
    private enterUIFormsAndHideOther(uiFormName: string,obj?:any) {
        let baseUIForm = this._MapCurrentShowUIForms[uiFormName];
        if (baseUIForm != null) return;
        for (let key in this._MapCurrentShowUIForms) {
            this._MapCurrentShowUIForms[key].hide();
            this._MapCurrentShowUIForms[key] = null;
            delete this._MapCurrentShowUIForms[key];
        }

        this._StaCurrentUIForms.forEach(uiForm => {
            uiForm.hide();
            this._MapCurrentShowUIForms[uiForm.UIFormName] = null;
            delete this._MapCurrentShowUIForms[uiForm.UIFormName];
        });

        let baseUIFormFromAll = this._MapAllUIForms[uiFormName];

        this._MapCurrentShowUIForms[uiFormName] = baseUIFormFromAll;
        baseUIFormFromAll.display();
        baseUIFormFromAll.init(obj);
    }

    private exitUIForms(uiFormName: string) {
        let baseUIForm = this._MapAllUIForms[uiFormName];
        if (baseUIForm == null) return;
        baseUIForm.hide();
        this._MapCurrentShowUIForms[uiFormName] = null;
        delete this._MapCurrentShowUIForms[uiFormName];

    }

    private popUIForm() {
        if (this._StaCurrentUIForms.length >= 1) {
            let topUIForm = this._StaCurrentUIForms.pop();
            topUIForm.hide();
        }
    }

    private exitUIFormsAndDisplayOther(uiFormName: string) {
        if (uiFormName == "" || uiFormName == null) return;

        let baseUIForm = this._MapCurrentShowUIForms[uiFormName];
        if (baseUIForm == null) return;
        baseUIForm.hide();
        this._MapCurrentShowUIForms[uiFormName] = null;
        delete this._MapCurrentShowUIForms[uiFormName];
    }
    private exitIndependentForms(uiFormName: string) {
        let baseUIForm = this._MapAllUIForms[uiFormName];
        if (baseUIForm == null) return;
        baseUIForm.hide();
        this._MapIndependentForms[uiFormName] = null;
        delete this._MapIndependentForms[uiFormName];
    }
    /** 加载资源 */
    public loadRes(url: string, type: typeof cc.Asset, progressCallback?: (completedCount: number, totalCount: number, item: any) => void) {
        if (!url || !type) {
            cc.log("参数错误", url, type);
            return;
        }

        return new Promise((resolve, reject) => {
            cc.loader.loadRes(url, type, progressCallback, (err, asset) => {
                if (err) {
                    cc.log(`[资源加载] 错误 ${err}`);
                    resolve(null);
                    return;
                }
                resolve(asset);
            });
        });
    }
}
