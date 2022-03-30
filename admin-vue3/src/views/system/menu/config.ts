// const menuObj = { 0: "菜单", 1: "菜单", 2: "按钮/权限" }
export const columns = [
    {
        title: '菜单名称',
        dataIndex: 'name',
        key: 'name'
    }, 
    {
        title: '菜单类型',
        dataIndex: 'menuType',
        key: 'menuType',
        customRender: ({ record }) => {
            return record.page_url ? '菜单' : '按钮'
        }
    },
     {
        title: 'icon',
        dataIndex: 'icon',
        key: 'icon'
    },
    {
        title: '组件',
        dataIndex: 'component',
        key: 'component',
    },
    {
        title: '路径',
        dataIndex: 'page_url',
        key: 'page_url',
    },
    {
        title: '控件地址',
        dataIndex: 'control_url',
        key: 'control_url',
    },
    {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort'
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
    label: "菜单名称",
    type: "input",
    key: "name",
    value: null,
    required: true,
    errMsg: "请输入",
    disabled: false
}, {
    label: "上级菜单",
    type: "treeSelect",
    key: "parent_id",
    value: null,
    required: false,
    errMsg: "请选择",
    disabled: false,
    options: []
},{
    label: "菜单路径",
    type: "input",
    key: "page_url",
    value: null,
    required: false,
    errMsg: "请输入",
    disabled: false,
},{
    label: "前端组件",
    type: "input",
    key: "component",
    value: null,
    required: false,
    errMsg: "请输入",
    disabled: false,
},{
    label: "控件地址",
    type: "input",
    key: "control_url",
    value: null,
    required: true,
    errMsg: "请输入",
    disabled: false,
},{
    label: "菜单图标",
    type: "input",
    key: "icon",
    value: '',
    required: false,
    errMsg: "请输入",
    disabled: false,
},{
    label: "排序",
    type: "number",
    key: "sort",
    value: 1,
    required: true,
    errMsg: "请输入",
    fieldType: 'number',
    disabled: false,
},{
    label: "是否显示",
    type: "select",
    key: "is_show",
    value: 1,
    required: true,
    errMsg: "请选择",
    fieldType: 'number',
    disabled: false,
    options: [
        {text: '显示', value: 1}, 
        {text: '隐藏', value: 0} 
    ]
},{
    label: "是否启用",
    type: "select",
    key: "is_enabled",
    value: 1,
    required: true,
    errMsg: "请选择",
    fieldType: 'number',
    disabled: false,
    options: [
        {text: '启用', value: 1}, 
        {text: '禁用', value: 0} 
    ]
}]