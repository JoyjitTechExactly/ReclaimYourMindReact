import { ActivityIndicator, StyleSheet, Text, View, ImageRequireSource, TouchableOpacity, ImageResizeMode, Image } from 'react-native'
import React, { FC, useCallback, useEffect, useState } from 'react'
import FastImage from 'react-native-fast-image'
export interface ImagePropsInterface {
    source: ImageRequireSource | any,
    resizeMode?: string,
    tintColor?: string,
    imageStyle?: any,
    loaderStyle?: any
}
const CustomImage: FC<ImagePropsInterface> = ({
    source,
    resizeMode = "contain",
    tintColor,
    imageStyle,
    loaderStyle,
}) => {
    const [resizeModeState, setResizeModeState] = useState<any>(FastImage.resizeMode.contain)
    const [loading, setLoading] = useState<boolean>(true)
    const [isImgErr, setIsImgErr] = useState<boolean>(false)
    useEffect(() => {
        if (resizeMode === "contain") {
            setResizeModeState(FastImage.resizeMode.contain)
        }
        if (resizeMode === "cover") {
            setResizeModeState(FastImage.resizeMode.cover)
        }
        if (resizeMode === "stretch") {
            setResizeModeState(FastImage.resizeMode.stretch)
        }
    }, [resizeMode])
    const onProgress = useCallback(() => {
        // setIsImgErr(false)
    }, [])
    const onError = () => {
        // setIsImgErr(true)
        setLoading(false)
    }
    const onLoad = useCallback(() => {
        setLoading(false)
    }, [])
    const onLoadEnd = useCallback(() => {
        setLoading(false)
    }, [])
    if (source === null || source === undefined) {
        return (
            <View style={[imageStyle]}>
            </View>
        )
    }
    if (Number.isInteger(source)) {
        return (
            <>
                {/* {
                    loading &&
                    <View style={[styles.loader, imageStyle]}>
                        <ActivityIndicator animating color={colors.white} />
                    </View>
                } */}
                <Image
                    source={source}
                    style={[imageStyle]}
                    resizeMode={resizeModeState}
                    onError={onError}
                    onLoad={onLoad}
                    onLoadEnd={onLoadEnd}
                    tintColor={tintColor}
                />
            </>
        )
    } else {
        return (
            <>
                {/* {
                    loading &&
                    <View style={[styles.loader, imageStyle, loaderStyle]}>
                        <ActivityIndicator animating color={AppColor.WhiteColor} />
                    </View>
                } */}
                <FastImage
                    style={[imageStyle]}
                    source={{
                        uri: source?.uri ?? source,
                        priority: FastImage.priority.high,
                    }}
                    resizeMode={resizeModeState}
                    onError={onError}
                    onLoad={onLoad}
                    onLoadEnd={onLoadEnd}
                    tintColor={tintColor}
                />
                
            </>
        )
    }
}
export default React.memo(CustomImage)
const styles = StyleSheet.create({
    loader: {
        position: 'absolute',
        // backgroundColor: ColorsPath.themeColor,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        zIndex: 9,
        marginTop: 10
    }
})