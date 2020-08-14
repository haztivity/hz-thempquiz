(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./HzThermoquizResource"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HzThermoquizResource_1 = require("./HzThermoquizResource");
    exports.HzThermoquizResource = HzThermoquizResource_1.HzThermoquizResource;
});
//# sourceMappingURL=HzThermoquiz.js.map