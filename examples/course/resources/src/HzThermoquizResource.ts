/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {Resource,ResourceController,$,EventEmitterFactory,ScormService,NavigatorService} from "@haztivity/core";
@Resource(
    {
        name:"HzThermoQuiz",
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
       
    }
    protected _onEnd(e){
        instance._markAsCompleted();
        if(instance._ScormService.LMSIsInitialized() && instance._id != undefined){
            instance._ScormService.doLMSSetValue(`cmi.objectives.${instance._objectiveIndex}.id`,instance._id);
            instance._ScormService.doLMSSetValue(`cmi.objectives.${instance._objectiveIndex}.status`,"passed");
            instance._ScormService.doLMSSetValue(`cmi.objectives.${instance._objectiveIndex}.score.raw`,100);
            instance._ScormService.doLMSCommit();
        }
    }
}
