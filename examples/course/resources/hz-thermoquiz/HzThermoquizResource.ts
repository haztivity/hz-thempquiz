/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {Resource,ResourceController,$,EventEmitterFactory,ScormService,NavigatorService} from "@haztivity/core";
import "jq-thermoquiz";
@Resource(
    {
        name:"HzThermoquiz",
        dependencies:[
            $,
            EventEmitterFactory,
            ScormService,
            NavigatorService
        ]
    }
)
export class HzThermoquizResource extends ResourceController{
    public static readonly NAMESPACE = "hzThermoquiz";
    /**
     * Componente de cabecera para haztivity.
     * @param _$
     * @param _EventEmitterFactory
     * @param _ScormService
     * @example
     * div(data-hz-component="HzHeader")
     *      h1(data-hz-header-title)
     */
    constructor(_$: JQueryStatic, _EventEmitterFactory,protected _ScormService:ScormService,protected _NavigatorService:NavigatorService) {
        super(_$, _EventEmitterFactory);
    }
    init(options, config?) {
        this._options = options;
        this._config = config;
        this._$element.thermoQuiz(this._options.thermo);
        this._assignEvents();
        this._initScorm();
    }
    protected _initScorm(){
        if(this._id != undefined) {
            if (this._ScormService.LMSIsInitialized()) {
                let objectiveIndex = this._findObjectiveIndex(this._id);
                if (objectiveIndex == -1) {
                    objectiveIndex = this._registerObjective();
                }
                this._objectiveIndex = objectiveIndex;
            }
        }
    }
    protected _registerObjective(){
        if(this._id != undefined) {
            let objectives = parseInt(this._ScormService.doLMSGetValue("cmi.objectives._count")),
                currentObjective = objectives;
            this._ScormService.doLMSSetValue(`cmi.objectives.${currentObjective}.id`, this._id);
            this._ScormService.doLMSSetValue(`cmi.objectives.${currentObjective}.status`, "not attempted");
            this._ScormService.doLMSCommit();
            return currentObjective;
        }
    }
    protected _findObjectiveIndex(id){
        let objectives = parseInt(this._ScormService.doLMSGetValue("cmi.objectives._count")),
            index = -1;
        for (let objectiveIndex = 0; objectiveIndex < objectives; objectiveIndex++) {
            let objective = "cmi.objectives."+objectiveIndex,
                objectiveId = this._ScormService.doLMSGetValue(objective+".id");
            //se busca el objetivo de la actividad actual
            if(objectiveId === id){
                index = objectiveIndex;
                objectiveIndex = objectives;
            }
        }
        return index;
    }
    protected _assignEvents(){
        const self = this;
        this._$element.on("thermoQuizCheckAnswers."+HzThermoquizResource.NAMESPACE, function(e, instance, value) {
            self._onEnd(value);
        });
    }
    protected _onEnd(value){
        this._markAsCompleted();
        if(this._ScormService.LMSIsInitialized() && this._id != undefined){
            const maxValue = this._$element.thermoQuiz("option","maxValue");
            const score = (value * 100) / maxValue;
            this._ScormService.doLMSSetValue(`cmi.objectives.${this._objectiveIndex}.id`,this._id);
            this._ScormService.doLMSSetValue(`cmi.objectives.${this._objectiveIndex}.status`,"completed");
            this._ScormService.doLMSSetValue(`cmi.objectives.${this._objectiveIndex}.score.raw`,value);
            this._ScormService.doLMSCommit();
        }
    }
}