export const columns = [
    {
        title: '#',
        dataIndex: 'menuType',
        key: 'menuType',
        customRender: ({ index }) => {
            return index + 1
        }
    },
    {
        title: '字典名称',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '字典编码',
        dataIndex: 'code',
        key: 'code'
    },
    {
        title: '描述',
        dataIndex: 'introduce',
        key: 'introduce'
    },
    {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        key: 'action',
        scopedSlots: { customRender: 'action' },
        align: 'center',
        width: 350
    }
]
export const itemColumns = [
    {
        title: '#',
        customRender: ({ index }) => {
            return index + 1
        }
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '值',
        dataIndex: 'value',
        key: 'value'
    },
    {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        key: 'action',
        scopedSlots: { customRender: 'action' },
        align: 'center',
        width: 200
    }
]
export const formArr = [
    {
        label: "字典名称",
        type: "input",
        key: "name",
        value: null,
        required: true,
        errMsg: "请输入",
        disabled: false
    }, {
        label: "字典key值",
        type: "input",
        key: "code",
        value: null,
        required: true,
        errMsg: "请输入",
        disabled: false
    }, {
        label: "描述",
        type: "textarea",
        key: "introduce",
        value: null,
        required: false,
        errMsg: "请输入",
        disabled: false
    }]

export const formDictArr = [
    {
        label: "名称",
        type: "input",
        key: "name",
        value: null,
        required: true,
        errMsg: "请输入",
        disabled: false
    }, {
        label: "key值",
        type: "input",
        key: "value",
        value: null,
        required: true,
        errMsg: "请输入",
        disabled: false
    }]