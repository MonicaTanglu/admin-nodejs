(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1e019c8c"],{"343e":function(e,t,n){"use strict";n.r(t);var c=n("7a23"),r={class:"table-operator"},a=Object(c["n"])(" 新增"),o=Object(c["n"])("删除");function u(e,t,n,u,i,d){var l=Object(c["O"])("icon-font"),b=Object(c["O"])("a-button"),s=Object(c["O"])("a-table"),f=Object(c["O"])("modal-form"),O=Object(c["O"])("a-card");return Object(c["F"])(),Object(c["k"])(O,{bordered:!1},{default:Object(c["ab"])((function(){return[Object(c["o"])("div",r,[Object(c["o"])(b,{onClick:e.handleAdd,type:"primary"},{icon:Object(c["ab"])((function(){return[Object(c["o"])(l,{type:"icon-plus"})]})),default:Object(c["ab"])((function(){return[a]})),_:1},8,["onClick"])]),Object(c["o"])("div",null,[Object(c["o"])(s,{columns:e.columns,"row-key":function(e){return e.id},size:"middle",pagination:!1,dataSource:e.dataSource,loading:e.loading},{bodyCell:Object(c["ab"])((function(t){var n=t.column,r=t.record;return["action"===n.key?(Object(c["F"])(),Object(c["k"])(c["b"],{key:0},[Object(c["o"])("a",{onClick:function(t){return e.handleEdit(r)}},"编辑",8,["onClick"]),Object(c["o"])(b,{class:"m-l-10",type:"link",danger:"",onClick:function(t){return e.handleDelete(r.id)}},{default:Object(c["ab"])((function(){return[o]})),_:2},1032,["onClick"])],64)):Object(c["l"])("",!0)]})),_:1},8,["columns","row-key","dataSource","loading"])]),Object(c["o"])(f,{ref:"modalForm",key:e.currentId,formArr:e.formData,onSubmit:e.submit},null,8,["formArr","onSubmit"])]})),_:1})}var i=n("5530"),d=(n("380f"),n("f64c")),l=n("2909"),b=(n("96cf"),n("1da1")),s=[{title:"序号",dataIndex:"index",key:"index",customRender:function(e){var t=e.index;return t+1}},{title:"部门名称",dataIndex:"name",key:"name"},{title:"编码",dataIndex:"code",key:"code"},{title:"操作",dataIndex:"action",fixed:"right",key:"action",scopedSlots:{customRender:"action"},align:"center",width:150}],f=[{label:"部门名称",type:"input",key:"name",value:null,required:!0,errMsg:"请输入",disabled:!1},{label:"上级节点",type:"treeSelect",key:"parent_id",value:null,required:!1,errMsg:"请选择",disabled:!1,options:[]},{label:"编码",type:"input",key:"code",value:null,required:!1,errMsg:"请输入",disabled:!1}],O=n("de46"),m=n("48b8"),j=n("5b21"),p=Object(c["p"])({components:{ModalForm:j["default"]},setup:function(){var e=Object(c["K"])(!1),t=Object(c["J"])({selectedRowKeys:[],dataSource:[],formData:f,currentId:""}),n=Object(c["K"])(),r={list:"/system/getBranchPage",delete:"/system/deleteBranch"},a=function(){var n=Object(b["a"])(regeneratorRuntime.mark((function n(){var c,a;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return e.value=!0,n.next=3,Object(O["b"])(r.list);case 3:c=n.sent,c&&(t.dataSource=c.result),a=Object(l["a"])(t.dataSource),a.unshift({id:"0",name:"----"}),t.formData[1].options=a,e.value=!1;case 9:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}();a();var o=function(e){t.currentId=e.id,setTimeout((function(){Object(m["e"])(n.value,e)}),100)},u=function(t){Object(m["g"])(r.delete,t,e,(function(e){e&&a()}))},j=function(){t.currentId="0",setTimeout((function(){Object(m["b"])(n.value)}),100)},p=function(){var e=Object(b["a"])(regeneratorRuntime.mark((function e(c){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return c["id"]=t.currentId,e.next=3,Object(O["c"])("/system/branchEdit/"+c["id"],c);case 3:r=e.sent,r&&(d["a"].success("操作成功"),Object(m["f"])(n.value),a());case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),y=function(e){t.selectedRowKeys=e};return Object(i["a"])(Object(i["a"])({},Object(c["U"])(t)),{},{loading:e,handleAdd:j,handleEdit:o,handleDelete:u,onSelectChange:y,submit:p,modalForm:n,columns:s})}});n("d6f0");p.render=u;t["default"]=p},d6f0:function(e,t,n){"use strict";n("dc12")},dc12:function(e,t,n){}}]);