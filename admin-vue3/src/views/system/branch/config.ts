// const menuObj = { 0: "菜单", 1: "菜单", 2: "按钮/权限" }
export const columns = [
    {
        title: '序号',
        dataIndex: 'index',
        key: "index",
        customRender: ({index}) => {
            return index + 1
        }
    },
    {
        title: '部门名称',
        dataIndex: 'name',
        key: 'name'
    }, 
    {
        title: '编码',
        dataIndex: 'code',
        key: 'code'
    }, 
    {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        key: 'action',
        scopedSlots: { customRender: 'action' },
        align: 'center',
        width: 150
    }
]
export interface OptionsCustom {
    id: string;
    name: string;
  }
export const formArr = [
//     {
//     label: "菜单类型",
//     type: "radio",
//     key: "menuType",
//     value: 0,
//     required: true,
//     errMsg: "请选择",
//     fieldType: 'number',
//     options: [
//         { value: 0, text: '一级菜单' },
//         { value: 1, text: '子菜单' },
//         { value: 2, text: '按钮/权限' },
//     ],
// },
 {
    label: "部门名称",
    type: "input",
    key: "name",
    value: null,
    required: true,
    errMsg: "请输入",
    disabled: false
}, {
    label: "上级节点",
    type: "treeSelect",
    key: "parent_id",
    value: null,
    required: false,
    errMsg: "请选择",
    disabled: false,
    options: [] as OptionsCustom[]
},{
    label: "编码",
    type: "input",
    key: "code",
    value: null,
    required: false,
    errMsg: "请输入",
    disabled: false
}]