'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

var _colors = require('material-ui/styles/colors')

var _colorManipulator = require('material-ui/utils/colorManipulator')

var _spacing = require('material-ui/styles/spacing')

var _spacing2 = _interopRequireDefault(_spacing)

function _interopRequireDefault(obj) {
    return obj && obj.__esModule
        ? obj
        : {
            default: obj
        }
}

exports.default = {
    spacing: _spacing2.default,
    fontFamily: 'Nunito, sans-serif',
    palette: {
        primary1Color: '#253B55',
        primary2Color: '#172336',
        primary3Color: _colors.grey400,
        accent1Color: _colors.blueGrey400,
        accent2Color: _colors.grey100,
        accent3Color: _colors.grey500,
        textColor: '#172336',
        secondaryTextColor: (0, _colorManipulator.fade)(_colors.darkBlack, 0.54),
        alternateTextColor: _colors.white,
        canvasColor: _colors.white,
        borderColor: _colors.grey300,
        disabledColor: (0, _colorManipulator.fade)(_colors.darkBlack, 0.3),
        pickerHeaderColor: _colors.cyan500,
        clockCircleColor: (0, _colorManipulator.fade)(_colors.darkBlack, 0.07),
        shadowColor: _colors.fullBlack
    }
}
