import React                from 'react'
import ReactDOM             from 'react-dom'
import injectTpEventPlugin  from 'react-tap-event-plugin'
import { Routes }           from './routes/Route'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import 'babel-polyfill'
import 'animate.css'
import 'jquery'
import 'whatwg-fetch'
import 'font-awesome/css/font-awesome.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'antd/dist/antd.min.css'
import 'antd/dist/antd.min.js'
import './style/index.style.scss'

const ELEMENT_TO_BOOTSTRAP  = 'root'
const BootstrapedElement    = document.getElementById(ELEMENT_TO_BOOTSTRAP)

injectTpEventPlugin()

ReactDOM.render(<Routes />, BootstrapedElement)
