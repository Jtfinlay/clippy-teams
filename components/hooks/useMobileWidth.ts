import React from 'react';
import useWindowDimensions from './useWindowDimensions';

export default function useMobileWidth() {
    const windowDimensions = useWindowDimensions();
    return windowDimensions.width < 500;
}