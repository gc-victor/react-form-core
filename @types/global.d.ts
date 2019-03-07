declare module 'storybook-readme';

declare module '*.png' {
    const resource: string;
    export = resource;
}
declare module '*.svg' {
    const resource: string;
    export = resource;
}
declare module '*.css' {
    const resource: any;
    export = resource;
}
declare module '*.json' {
    const resource: any;
    export = resource;
}

declare module '*.md' {
    const value: string;
    export default value;
}

declare module "*!txt" {
    const content: string;
    export default content;
}
