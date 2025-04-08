"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpdateFlow = void 0;
exports.checkForUpdate = checkForUpdate;
var _reactNative = require("react-native");
const LINKING_ERROR = `The package 'react-native-in-app-updates' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const InAppUpdates = _reactNative.NativeModules.InAppUpdates ? _reactNative.NativeModules.InAppUpdates : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
let UpdateFlow = exports.UpdateFlow = /*#__PURE__*/function (UpdateFlow) {
  UpdateFlow["IMMEDIATE"] = "IMMEDIATE";
  UpdateFlow["FLEXIBLE"] = "FLEXIBLE";
  return UpdateFlow;
}({});
function checkForUpdate(updateFlow) {
  if (_reactNative.Platform.OS !== 'android') {
    return Promise.reject(new Error('This library is only available on Android.'));
  }
  if (![UpdateFlow.IMMEDIATE, UpdateFlow.FLEXIBLE].includes(updateFlow)) {
    return Promise.reject(new Error('Invalid update flow. Use UpdateFlow.IMMEDIATE or UpdateFlow.FLEXIBLE.'));
  }
  return InAppUpdates.checkForUpdate(updateFlow);
}
//# sourceMappingURL=index.js.map