import {
    Form, Input, DatePicker, Switch, Checkbox, Radio, Button, Layout, Menu, Row, Col,
    Dropdown, Avatar, Tabs, Table, Alert, Card, List,
    Pagination, Divider, Modal, Select, Popconfirm, Drawer, Spin, InputNumber, AutoComplete,
    TreeSelect, Tree
} from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';

const components = [
    Form,
    Input,
    DatePicker,
    Switch,
    Checkbox,
    Radio,
    Button,
    Layout,
    Menu,
    Row,
    Col,
    Dropdown,
    Avatar,
    Tabs,
    Table,
    Alert,
    Card,
    List,
    Pagination,
    Divider,
    Modal,
    Select,
    Popconfirm,
    Drawer,
    Spin,
    InputNumber,
    AutoComplete,
    TreeSelect,
    Tree
]
export function setupAntd (app) {
    components.forEach(component => {
        app.use(component)
    })
}