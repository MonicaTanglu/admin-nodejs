import { Modal, message } from 'ant-design-vue'
import { deleteAction } from '@/api/api'
import { Ref } from 'vue'
// 批量删除
export function batchDelCommon(url, rowKeys, loading: Ref, cb) {
    let ids = "";
    for (let a = 0; a < rowKeys.length; a++) {
        ids += rowKeys[a] + ",";
    }
    Modal.confirm({
        title: '确认删除',
        content: "是否删除选中数据？",
        onOk: () => {
            loading.value = true
            deleteAction(url, { ids: ids }).then(res => {
                if (res) {
                    message.success('删除成功')
                    cb(true)
                } else cb(false)
            }).catch(() => {
                cb(false)
            }).finally(() => {
                loading.value = false
            })
        },
        onCancel: () => {
            cb(false)
        }
    })

}
export function singleDeleteCommon(url, id, loading: Ref, cb) {
    Modal.confirm({
        title: '确认删除',
        content: "确定要删除这条数据吗？",
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
            loading.value = true
            deleteAction(url + '/' + id).then(res => {
                if (res) {
                    message.success('删除成功')
                    cb(true)
                } else cb(false)
            }).catch(() => {
                cb(false)
            }).finally(() => {
                loading.value = false
            })
        },
        onCancel: () => {
            cb(false)
        }
    })
}

export function handleCommonEdit(modalForm, record) {
    modalForm.edit(record)
    modalForm.title = '编辑'
    modalForm.disableSubmit = false
}

export function handleCommonDetail(modalForm, record) {
    modalForm.edit(record)
    modalForm.title = '详情'
    modalForm.disableSubmit = true
}

export function handleCommonAdd(modalForm) {
    modalForm.add()
    modalForm.title = '新增'
    modalForm.disableSubmit = false
}
export function handleCommonAddSub(modalForm, parentId) {
    modalForm.edit({ parentId: parentId, menuType: 1 })
    modalForm.title = '新增'
    modalForm.disableSubmit = false
}

export function setModalLoading(modalForm) {
    // modalForm.confirmLoading = false
    modalForm.handleCancel()
}