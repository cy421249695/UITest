/**窗体类型 */
export enum UIFormType {
    /** 普通窗口 */
    Normal,
    /** 固定窗口 */
    Fixed,                      
    /** 弹出窗口 */
    PopUp,    
    /** 独立窗口 */
    Independent,                  
}

/**显示类型 */
export enum UIFormShowMode {
    /** 普通, 窗体的显示和关闭并不会影响其他窗体 */
    Normal,
    /** 反向切换, 窗体关闭时, 会显示其他窗体 */
    ReverseChange,
    /** 隐藏其他, 窗体显示时, 会隐藏其他窗体 */
    HideOther,
    /** 独立显示, 不受其他窗体影响 */
    Independent,

}

export class SysDefine {
    public static SYS_UIROOT_NAME = "Canvas/UIRoot";

    /* 节点常量 */
    public static SYS_NORMAL_NODE = "Normal";
    public static SYS_FIXED_NODE = "Fixed";
    public static SYS_POPUP_NODE = "PopUp";
    public static SYS_INDEPENDENT_NODE = "Independent";
}