
import cx from 'classnames'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { Form, Card, Select, Input, Switch, Radio, Slider, Button, Upload, Icon, Row, message, Checkbox, Tabs, Table } from 'antd'

import { Loader } from '../../components'

const CheckboxGroup = Checkbox.Group;

const plainOptions = [{label:'Create', value: 'c'}, {label:'Read', value: 'r', disabled: true}, {label:'Update', value: 'u'}, {label:'Delete', value: 'd'}, {label:'Execute', value: 'x'}];
const defaultCheckedList = ['r'];
const allChecked = ['c', 'r', 'u', 'd', 'x']


const landscapeColumns = [{
  title: 'Name',
  dataIndex: 'name',
  render: text => <a href="#">{text}</a>,
}, {
  title: 'Description',
  dataIndex: 'description',
}];

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  render: text => <a href="#">{text}</a>,
}, {
  title: 'Age',
  dataIndex: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
}];
const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}

const pagination = {
  total: data.length,
  showSizeChanger: true,
  onShowSizeChange: (current, pageSize) => {
    console.log('Current: ', current, '; PageSize: ', pageSize);
  },
  onChange: (current) => {
    console.log('Current: ', current);
  },
};

const FormItem = Form.Item
const Dragger = Upload.Dragger
const TabPane = Tabs.TabPane;


class CreateGroup extends Component {

    state = {
        animated: true,
        viewEntersAnim: true,
        checkedList: defaultCheckedList,
        indeterminate: true,
        checkAll: false
    }

    componentDidMount() {
        const { enterGroups } = this.props
        enterGroups()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
    }

    componentWillUnmount() {
        const { leaveGroups } = this.props
        leaveGroups()
    }

    render() {

        let self = this
        const { animated, viewEntersAnim } = this.state
        const { loading, groups, landscapes } = this.props
        const { getFieldDecorator } = this.props.form


        console.log('GROUPS', groups)
        console.log('landscapes', landscapes)
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 }
        }

        const rowSelection = {
          onChange: (selectedRowKeys, selectedRows) => {
            this.setState({ selectedRows: selectedRows})
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          },
          onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
          },
          getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User',    // Column configuration not to be checked
          }),
        };

        if(landscapes){
          console.log('landscapes', landscapes)
          var landscapeIds = landscapes.map((index, landscape) =>{
            return {key: landscape._id, id: landscape._id, name: landscape.name, description: landscape.description}
          })
        }

        if (loading) {
            return (
                <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                    <Loader/>
                </div>
            )
        }

        return (
            <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                <h5>Create Group</h5><br/><br/>
                <Form style={{ width: '100%' }} onSubmit={this.handleSubmit}>
                <Tabs defaultActiveKey="1" onChange={this.callback}>
                  <TabPane tab="Group" key="1">
                          <FormItem
                              {...formItemLayout}
                              label='Name'
                          >
                              {getFieldDecorator('name', {
                                  rules: [{ required: true, message: 'Please input name of the group' }],
                              })(
                                  <Input placeholder='Group Name' />
                              )}
                          </FormItem>

                          <FormItem
                              {...formItemLayout}
                              label='Description'
                          >
                              {getFieldDecorator('description', {})(
                                  <Input type="textarea" rows={4} placeholder='Description' />
                              )}
                          </FormItem>
                          <FormItem
                              {...formItemLayout}
                              label='Permissions'
                          >

                            <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                              <Checkbox
                                indeterminate={this.state.indeterminate}
                                onChange={this.onCheckAllChange}
                                checked={this.state.checkAll}
                              >
                                Check all
                              </Checkbox>
                            </div>
                            <br />
                            <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onCheckedChange} />
                            </FormItem>
                          <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                              <Button type='primary' htmlType='submit' disabled={loading} onClick={this.handlesCreateClick}>
                                  Create
                              </Button>
                          </FormItem>


                  </TabPane>
                  <TabPane tab="Users" key="2">
                    <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={pagination}/>
                  </TabPane>
                  <TabPane tab="Landscapes" key="3">
                    <Table rowSelection={rowSelection} columns={landscapeColumns} dataSource={landscapes} pagination={pagination}/>
                  </TabPane>
                </Tabs>
                </Form>
            </div>
        )
    }

    handlesGroupClick = event => {
        const { router } = this.context
        router.push({ pathname: '/protected' })
    }

    handlesOnEmailChange = event => {
        event.preventDefault()
        // should add some validator before setState in real use cases
        this.setState({ username: event.target.value })
    }

    handlesOnPasswordChange = event => {
        event.preventDefault()
        // should add some validator before setState in real use cases
        this.setState({ password: event.target.value })
    }

    handlesCreateClick = event => {
        const { router } = this.context

        event.preventDefault()

        let groupToCreate = this.props.form.getFieldsValue()
        groupToCreate.permissions = this.state.checkedList
        groupToCreate.users = []
        // groupToCreate.landscapes = this.state.selectedRows;
        console.log('this.state.selectedRows', this.state.selectedRows)
        groupToCreate.landscapes = this.state.selectedRows.map((row, i) =>{
          return row._id
        });
        console.log('creating group -', groupToCreate)
        console.log('this.props -', this.props)
        this.props.CreateGroupWithMutation({
            variables: { group: groupToCreate }
         }).then(({ data }) => {
            console.log('got data', data)
            message.config({
              top: 5,
              duration: 5,
            });

            message.success('Group was successfully created.');
            router.push({ pathname: '/groups' })
        }).catch((error) => {
            message.fail('An error occurred while creating group.');

            console.log('there was an error sending the query', error)
        })

    }

    closeError = (event) => {
        event.preventDefault()
        const { resetError } = this.props
        resetError()
    }
    onCheckedChange = (checkedList) =>{
      this.setState({
        checkedList,
        indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
        checkAll: checkedList.length === plainOptions.length,
      });
      console.log(this.state)
    }
    onCheckAllChange = (e) => {
      this.setState({
        checkedList: e.target.checked ? allChecked : ['r'],
        indeterminate: false,
        checkAll: e.target.checked,
      });
      console.log(this.state)
    }

    callback = (key) => {
      console.log(key);
    }
}

CreateGroup.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterGroups: PropTypes.func.isRequired,
    leaveGroups: PropTypes.func.isRequired
}

CreateGroup.contextTypes = {
    router: PropTypes.object
}

export default Form.create()(CreateGroup)
