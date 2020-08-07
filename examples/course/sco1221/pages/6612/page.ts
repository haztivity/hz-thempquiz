/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {PageFactory, PageRegister, PageController} from "@haztivity/core";
import template from "./page.pug";
import {HzThermoquizResource} from "../../../resources/hz-thermoquiz/HzThermoquiz";
export let page: PageRegister = PageFactory.createPage(
    {
        name: "6612",
        resources: [
            HzThermoquizResource
        ],
        template: template
    }
);
page.on(
    PageController.ON_SHOW, null, (eventObject, $page, $oldPage, oldPageRelativePosition, pageController) => {
        
    }
);
