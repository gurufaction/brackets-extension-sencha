{
    "PROJECT_NAME"      :   "{{PROJECT_NAME}}",
    "PROJECT_NAMESPACE" :   "{{PROJECT_NAMESPACE}}",
    "SDK_DIR"           :   "{{SDK_DIR}}",
    "SRC_DIR"           :   "{{SRC_DIR}}",
    "LIB_DIR"           :   "{{LIB_DIR}}",
    "CLIENT_DIR"        :   "{{CLIENT_DIR}}",
    "SERVER_DIR"        :   "{{SERVER_DIR}}",
    "MODELS"            :   [
    {{#MODELS}}
        {
            "NAME"      :   "{{NAME}}",
            "FULL_NAME" :   "{{FULL_NAME}}",
            "FIELDS"    :   [
                {{#FIELDS}}
                { "NAME": "{{NAME}}", "TYPE": "{{TYPE}}"}{{^LAST}},{{/LAST}}
                {{/FIELDS}}
            ]
        }{{^LAST}},{{/LAST}}
    {{/MODELS}}
    ]
}