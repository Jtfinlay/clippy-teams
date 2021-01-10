import useWindowDimensions from './useWindowDimensions';

export default function useDisplayDimensions() {
    const windowDimensions = useWindowDimensions();

    let width = 500;
    let height = 750;

    const isMobile = windowDimensions.width < 500;
    if (isMobile) {
        const widthScale = windowDimensions.width / width;
        width = windowDimensions.width;
        height *= widthScale;
    }
  
    return [width, height];
}