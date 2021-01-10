

export default function useIsApplePhone() {
    // Yes, this is dumb
    // But iOS autoplay policies don't allow for autoplay videos on web with audio. So for iOS (and only iOS), playback is muted by default.
    // Alternative might be to wire up an elaborate key-event when user opens the stories? Per keydown event notes here:
    // https://webkit.org/blog/6784/new-video-policies-for-ios/
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