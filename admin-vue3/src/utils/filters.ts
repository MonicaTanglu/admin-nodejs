export default {
    ellipsis(value, vlength = 25) {
        if (!value) return ''
        if (value.length > vlength) {
            return value.slice(0, vlength) + '...'
        }
        return value
    }
}