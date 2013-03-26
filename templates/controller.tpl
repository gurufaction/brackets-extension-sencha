Ext.define('{{PROJECT_NAMESPACE}}.controller.{{NAME}}', {
    extend: 'Ext.app.Controller',

    views: [
        {{#VIEWS}}
        '{{NAME}}'{{^LAST}},{{/LAST}}
        {{/VIEWS}}
    ],
    
    init: function() {
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