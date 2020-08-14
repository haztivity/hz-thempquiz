var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@haztivity/core", "jq-thermoquiz"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @license
     * Copyright Davinchi. All Rights Reserved.
     */
    var core_1 = require("@haztivity/core");
    require("jq-thermoquiz");
    var HzThermoquizResource = /** @class */ (function (_super) {
        __extends(HzThermoquizResource, _super);
        /**
         * Componente de cabecera para haztivity.
         * @param _$
         * @param _EventEmitterFactory
         * @param _ScormService
         * @example
         * div(data-hz-component="HzHeader")
         *      h1(data-hz-header-title)
         */
        function HzThermoquizResource(_$, _EventEmitterFactory, _ScormService, _NavigatorService) {
            var _this = _super.call(this, _$, _EventEmitterFactory) || this;
            _this._ScormService = _ScormService;
            _this._NavigatorService = _NavigatorService;
            return _this;
        }
        HzThermoquizResource_1 = HzThermoquizResource;
        HzThermoquizResource.prototype.init = function (options, config) {
            this._options = options;
            this._config = config;
            this._$element.thermoQuiz(this._options.thermo);
            this._assignEvents();
            this._initScorm();
        };
        HzThermoquizResource.prototype._initScorm = function () {
            if (this._id != undefined) {
                if (this._ScormService.LMSIsInitialized()) {
                    var objectiveIndex = this._findObjectiveIndex(this._id);
                    if (objectiveIndex == -1) {
                        objectiveIndex = this._registerObjective();
                    }
                    this._objectiveIndex = objectiveIndex;
                }
            }
        };
        HzThermoquizResource.prototype._registerObjective = function () {
            if (this._id != undefined) {
                var objectives = parseInt(this._ScormService.doLMSGetValue("cmi.objectives._count")), currentObjective = objectives;
                this._ScormService.doLMSSetValue("cmi.objectives." + currentObjective + ".id", this._id);
                this._ScormService.doLMSSetValue("cmi.objectives." + currentObjective + ".status", "not attempted");
                this._ScormService.doLMSCommit();
                return currentObjective;
            }
        };
        HzThermoquizResource.prototype._findObjectiveIndex = function (id) {
            var objectives = parseInt(this._ScormService.doLMSGetValue("cmi.objectives._count")), index = -1;
            for (var objectiveIndex = 0; objectiveIndex < objectives; objectiveIndex++) {
                var objective = "cmi.objectives." + objectiveIndex, objectiveId = this._ScormService.doLMSGetValue(objective + ".id");
                //se busca el objetivo de la actividad actual
                if (objectiveId === id) {
                    index = objectiveIndex;
                    objectiveIndex = objectives;
                }
            }
            return index;
        };
        HzThermoquizResource.prototype._assignEvents = function () {
            var self = this;
            this._$element.on("thermoQuizCheckAnswers." + HzThermoquizResource_1.NAMESPACE, function (e, instance, value) {
                self._onEnd(value);
            });
        };
        HzThermoquizResource.prototype._onEnd = function (value) {
            this._markAsCompleted();
            if (this._ScormService.LMSIsInitialized() && this._id != undefined) {
                var maxValue = this._$element.thermoQuiz("option", "maxValue");
                var score = (value * 100) / maxValue;
                this._ScormService.doLMSSetValue("cmi.objectives." + this._objectiveIndex + ".id", this._id);
                this._ScormService.doLMSSetValue("cmi.objectives." + this._objectiveIndex + ".status", "completed");
                this._ScormService.doLMSSetValue("cmi.objectives." + this._objectiveIndex + ".score.raw", value);
                this._ScormService.doLMSCommit();
            }
        };
        HzThermoquizResource.NAMESPACE = "hzThermoquiz";
        HzThermoquizResource = HzThermoquizResource_1 = __decorate([
            core_1.Resource({
                name: "HzThermoquiz",
                dependencies: [
                    core_1.$,
                    core_1.EventEmitterFactory,
                    core_1.ScormService,
                    core_1.NavigatorService
                ]
            })
        ], HzThermoquizResource);
        return HzThermoquizResource;
        var HzThermoquizResource_1;
    }(core_1.ResourceController));
    exports.HzThermoquizResource = HzThermoquizResource;
});
//# sourceMappingURL=HzThermoquizResource.js.map