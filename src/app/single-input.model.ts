export class SingleInput {
    label: string
    name: string
    type: string
    value: null
    rules: string
    options: {label: string, balue: string}[]
    default_value: null
    multiple: boolean
    readonly: boolean
    placeholder: string
    info: string

    constructor(
        label: string,
        name: string,
        type: string,
        value: null,
        rules: string,
        options: {label: string, balue: string}[],
        default_value: null,
        multiple: boolean,
        readonly: boolean,
        placeholder: string,
        info: string
    ) { 
        this.label = label;
        this.name = name;
        this.type = type;
        this.value = value,
        this.rules = rules,
        this.options = options;
        this.default_value = default_value;
        this.multiple = multiple;
        this.readonly = readonly;
        this.placeholder = placeholder;
        this.info = info
     }
}