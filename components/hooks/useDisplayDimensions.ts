import React from 'react';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}
  
  export default function useDisplayDimensions() {
    const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());

    React.useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    
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