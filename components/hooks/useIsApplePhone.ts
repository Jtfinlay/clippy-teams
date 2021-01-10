

export default function useIsApplePhone() {
    // Yes, this is dumb
    // But iOS autoplay policies don't allow for autoplay videos on web with audio. So for iOS (and only iOS), playback is muted by default.
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}