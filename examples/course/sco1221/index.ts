/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {ScoFactory, Sco, ISco} from "@haztivity/core";
import template from "./sco.pug";
import {HzNavbarComponent} from "@haztivity/hz-navbar";
import "./main.scss";
import "jquery-ui-dist/jquery-ui.css";
import {page as page6611} from "./pages/6611/page";
import {page as page6612} from "./pages/6612/page";
let sco: ISco = ScoFactory.createSco(
    {
        name: "1221",
        template:template,
        pages: [
            page6611,
            page6612
        ],
        components: [
            HzNavbarComponent
        ]
    }
);
sco.run();