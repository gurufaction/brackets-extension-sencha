/*global Ext */

Ext.define('{{PROJECT_NAMESPACE}}.controller.{{NAME}}', {
    extend: 'Ext.app.Controller',

    stores: [
        {{#STORES}}
        '{{NAME}}'{{^LAST}},{{/LAST}}
        {{/STORES}}
    ],
    
    models: [
        {{#MODELS}}
        '{{NAME}}'{{^LAST}},{{/LAST}}
        {{/MODLES}}
    ],
    
    views: [
        {{#VIEWS}}
        '{{NAME}}'{{^LAST}},{{/LAST}}
        {{/VIEWS}}
    ],
    
    init: function() {
        "use strict";
        
        {{#CONTROL}}
        this.control({
            {{#VIEWS}}
            '{{ALIAS}}': {
                {{EVENT_NAME}}: this.{{EVENT_METHOD}}{{^LAST}},{{/LAST}}
            }{{^LAST}},{{/LAST}}
            {{/VIEWS}}
        });
        {{/CONTROL}}
    }
});