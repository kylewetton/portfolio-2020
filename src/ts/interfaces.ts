interface Point {
    x: number;
    y: number;
 }

interface ErrorResponse {
    location: string;
    msg: string;
    param: string;
    value?: string;
}

interface FormAuthResponse extends Response {
    errors: ErrorResponse[];
}

interface FormFields {
    [index: string]: HTMLInputElement;
}

interface AnimationTrack {
    panel: HTMLElement;
    animation: any; 
}

interface SlinkySettings {
    size: number;
    growSize: number;
    laziness: number;
    stiffness: number;
}