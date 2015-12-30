interface MediaStreamTrack {
    /* readonly */ kind: string;
    /* readonly */ id: string;
    /* readonly */ label: string;

    enabled: boolean;
    /* readonly */ muted: boolean;

    onmute: EventListener;
    onunmute: EventListener;

    /* readonly */ _readonly: boolean;
    /* readonly */ remote: boolean;
    /* readonly */ readyState: MediaStreamTrackState;

    onended: EventListener;

    clone(): MediaStreamTrack;
    stop(): void;

    getConstraints(): MediaTrackConstraints;
    getSettings(): MediaSourceSettings;
    getCapabilities(): MediaTrackCapabilities;

    applyConstraints(constraints: MediaTrackConstraints, successCallback?: Function, errorCallback?: Function): void;

    onoverconstrained: EventListener;

    // EventTarget interface
    addEventListener(
        type: string,
        listener: EventListener,
        useCapture?: boolean): void;

    removeEventListener(
        type: string,
        listener: EventListener,
        useCapture?: boolean): void;

    dispatchEvent(event: Event): boolean;
}

declare enum MediaStreamTrackState {
    live,
    ended
}

interface MediaTrackCapabilities {
    width?: number | any;
    height?: number | any;
    aspectRatio?: number;
    frameRate?: number;
    facingMode?: string;
    volume?: number;
    sampleRate?: number;
    sampleSize?: number;
    echoCancellation?: boolean;
    deviceId?: string;
    groupId?: string;
}

interface MediaSourceSettings {
    width?: number | any;
    height?: number | any;
    aspectRatio?: number;
    frameRate?: number;
    facingMode?: string;
    volume?: number;
    sampleRate?: number;
    sampleSize?: number;
    echoCancellation?: boolean;
    deviceId?: string;
    groupId?: string;
}

interface MediaTrackConstraint {
    width?: number | any;
    height?: number | any;
    aspectRatio?: number;
    frameRate?: number;
    facingMode?: string;
    volume?: number;
    sampleRate?: number;
    sampleSize?: number;
    echoCancellation?: boolean;
    deviceId?: string;
    groupId?: string;
}

interface MediaTrackConstraints {
    mandatory: MediaTrackConstraint[];
    optional: MediaTrackConstraint[];
}

interface MediaStream {

    /* readonly */ id: string;

    getAudioTracks(): MediaStreamTrack[];
    getVideoTracks(): MediaStreamTrack[];
    getTracks(): MediaStreamTrack[];

    getTrackById(trackId: string): MediaStreamTrack;

    addTrack(track: MediaStreamTrack): void;
    removeTrack(track: MediaStreamTrack): void;

    clone(): MediaStream;

    /* readonly */ active: boolean;

    onactive: EventListener;
    oninactive: EventListener;
    onaddtrack: EventListener;
    onremovetrack: EventListener;

    // EventTarget interface
    addEventListener(
        type: string,
        listener: EventListener,
        useCapture?: boolean): void;

    removeEventListener(
        type: string,
        listener: EventListener,
        useCapture?: boolean): void;

    dispatchEvent(event: Event): boolean;
}
