import Vue from 'vue'
import {
  Button, Form, FormItem, Input, Message, Container, Aside,
  Main, Header, Menu, Submenu, MenuItem, MenuItemGroup, Breadcrumb,
  BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch,
  Tooltip, Pagination, Dialog, MessageBox, Tag, Tree, Cascader,
  Alert, Tabs, TabPane, Steps, Step, Checkbox, CheckboxGroup,
  Upload, Timeline, TimelineItem
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
