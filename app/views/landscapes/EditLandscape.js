import React, { Component, PropTypes } from 'react'
import axios from 'axios'
import cx from 'classnames'
import { Row, Col } from 'react-flexbox-grid'
import Dropzone from 'react-dropzone'
import { IoCube } from 'react-icons/lib/io'
import IconButton from 'material-ui/IconButton'
import shallowCompare from 'react-addons-shallow-compare'
import UploadIcon from 'material-ui/svg-icons/file/file-upload'
import { Paper, FlatButton, RaisedButton, Checkbox, TextField } from 'material-ui'

class EditLandscape extends Component {

    state = {
        animated: true,
        viewEntersAnim: true
    }

    componentDidMount() {
        const { enterLandscapes, landscapes, params } = this.props

        let currentLandscape = landscapes.find(ls => { return ls._id === params.id })

        enterLandscapes()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
    }

    componentWillUnmount() {
        const { leaveLandscapes } = this.props
        leaveLandscapes()
    }

    render() {

        let self = this
        const { animated, viewEntersAnim } = this.state
        const { loading, landscapes, params } = this.props

        let currentLandscape = landscapes.find(ls => { return ls._id === params.id })

        if (loading) {
            return (
                <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                    <Loader/>
                </div>
            )
        }

        return (
            <Row center='xs' middle='xs' className={cx({ 'screen-height': true, 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                <Col xs={6} lg={9} className={cx( { 'create-landscape': true } )}>
                    <Paper zDepth={1} rounded={false}>

                        <RaisedButton label='Update' onClick={this.handlesUpdateClick}
                            style={{ margin: 50, float: 'right' }}
                            labelStyle={{ textTransform: 'none' }}/>

                        <TextField id='name' ref='name' defaultValue={currentLandscape.name} floatingLabelText='Name' className={cx( { 'two-field-row': true } )}/>
                        <TextField id='version' ref='version' defaultValue={currentLandscape.version} floatingLabelText='Version' className={cx( { 'two-field-row': true } )}/>

                        <TextField id='description' ref='description' defaultValue={currentLandscape.description} multiLine={true} rows={4} floatingLabelText='Description' fullWidth={true}
                            floatingLabelStyle={{ left: '0px' }}/>

                        <TextField id='infoLink' ref='infoLink' defaultValue={currentLandscape.infoLink} floatingLabelText='Info Link' fullWidth={true}/>
                        <TextField id='infoLinkText' ref='infoLinkText' defaultValue={currentLandscape.infoLinkText} floatingLabelText='Link Test' fullWidth={true}/>

                        <Dropzone id='imageUri' onDrop={this.handlesImageUpload} multiple={false} accept='image/*'
                            style={{ marginLeft: '10px', width: '180px', padding: '15px 0px' }}>
                            {
                                this.state.imageUri || currentLandscape.imageUri
                                ?
                                    <Row middle='xs'>
                                        <img src={this.state.imageUri || currentLandscape.imageUri} style={{ margin: '0 10px', height: '50px' }}/>
                                        <span style={{ fontSize: '11px' }}>{this.state.imageFileName || 'CURRENT IMAGE'}</span>
                                    </Row>
                                :
                                    <Row middle='xs'>
                                        <IconButton>
                                            <UploadIcon/>
                                        </IconButton>
                                        <span style={{ fontSize: '11px' }}>LANDSCAPE IMAGE</span>
                                    </Row>
                            }
                        </Dropzone>

                        <Dropzone id='cloudFormationTemplate' onDrop={this.handlesTemplateClick} multiple={false}
                            style={{ border: 'black 1px solid', width: '100%', height: 150, padding: '15px 0px' }}
                            activeStyle={{ border: 'limegreen 1px solid', width: '100%', padding: '15px 0px' }}>
                            {
                                this.state.cloudFormationTemplate || currentLandscape.cloudFormationTemplate
                                ?
                                    <textarea rows={100} style={{ background: '#f9f9f9', fontFamily: 'monospace', width: '100%' }}>{ currentLandscape.cloudFormationTemplate || this.state.cloudFormationTemplate }</textarea>
                                :
                                    <Row center='xs' middle='xs'>
                                        <Col style={{ marginTop: 25 }}>
                                            <IoCube size={42}/>
                                        </Col>
                                        <div style={{ fontSize: '12px', width: '100%', margin: '10px 0px' }}> Drop
                                            <strong style={{ fontSize: '12px' }}> JSON </strong> or
                                            <strong style={{ fontSize: '12px' }}> YAML </strong> file
                                        </div>
                                    </Row>
                            }
                        </Dropzone>
                    </Paper>
                </Col>
            </Row>
        )
    }

    handlesImageUpload = (acceptedFiles, rejectedFiles) => {
        let reader = new FileReader()

        reader.readAsDataURL(acceptedFiles[0])
        reader.onload = () => {
            this.setState({
                imageUri: reader.result,
                imageFileName: acceptedFiles[0].name
            })
        }

        reader.onerror = error => {
            console.log('Error: ', error)
        }
    }

    handlesTemplateClick = (acceptedFiles, rejectedFiles) => {

        let self = this
        let data = new FormData()

        data.append('file', acceptedFiles[0])

        axios.post('http://0.0.0.0:8080/api/upload/template', data).then(res => {
            self.setState({
                cloudFormationTemplate: JSON.stringify(res.data, null, 4)
            })
        }).catch(err => {
            console.log(err)
        })
    }

    handlesUpdateClick = event => {
        event.preventDefault()
        const { mutate, landscapes, params } = this.props
        const { router } = this.context

        let currentLandscape = landscapes.find(ls => { return ls._id === params.id })

        let landscapeToUpdate = {}
        // map all fields to landscapeToUpdate
        for (let key in this.refs) {
            landscapeToUpdate[key] = this.refs[key].getValue()
        }
        // attach imageUri and cloudFormationTemplate
        landscapeToUpdate._id = currentLandscape._id
        landscapeToUpdate.imageUri = this.state.imageUri || ''
        landscapeToUpdate.cloudFormationTemplate = this.state.cloudFormationTemplate || ''

        mutate({
            variables: { landscape: landscapeToUpdate }
         }).then(({ data }) => {
            console.log('landscape updated', data)
            router.push({ pathname: '/landscapes' })
        }).catch((error) => {
            console.log('there was an error sending the query', error)
        })
    }

    closeError = (event) => {
        event.preventDefault()
        const { resetError } = this.props
        resetError()
    }
}

EditLandscape.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterLandscapes: PropTypes.func.isRequired,
    leaveLandscapes: PropTypes.func.isRequired
}

EditLandscape.contextTypes = {
    router: PropTypes.object
}

export default EditLandscape
