function resolvSelectJson(result, node) {
    const data = [];
    node.forEach(item => {
        let prefix = "";
        for (let i = 0; i < item.level; i++) {
            prefix += "　　";
        }
        data.push({
            id: item.id,
            name: prefix + item.name
        })
        if (result[item.id]) {
            let ret = resolvSelectJson(result, result[item.id]);
            ret.forEach(item => {
                let prefix = "";
                for (let i = 0; i < item.level; i++) {
                    prefix += "　　";
                }
                data.push({
                    id: item.id,
                    name: prefix + item.name
                });
            })
        }
    });
    return data;
}
function setWhereParams (obj) {
    let searchParams = {}
    for (let key in obj) {
        if (key !== 'pageNo' && key !== 'pageSize' && key !== '_t') {
            if (obj[key]) {
                searchParams[key] = obj[key]
            }
        }
    }
    return searchParams
}

exports.resolvSelectJson = resolvSelectJson;
exports.setWhereParams = setWhereParams