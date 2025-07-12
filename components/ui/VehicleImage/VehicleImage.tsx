import React from "react";
import { ImageBackground, Image, View } from "react-native";

export enum VehicleImageGenerator {
  TINT_MASK = 0,
  CUSTOM_IMAGE
}

export function VehicleImage({generatorData} : {generatorData : any}) {
  const baseImage = {uri: "https://www.openvehicles.com/downloads/"+generatorData.imageName}
  const maskImage =  {uri: "https://www.openvehicles.com/downloads/"+generatorData.maskName}

  switch(generatorData.generator) {
    case VehicleImageGenerator.TINT_MASK:
      return (
        <View style={{flex: 1, flexDirection: 'row'}}>
          <ImageBackground style={{aspectRatio: 654/302, flex : 1}} resizeMode="contain" source={baseImage}>
            <Image source={maskImage} resizeMode="contain" style={{aspectRatio: 654/302, flex:1, tintColor: generatorData.tintColor, mixBlendMode: 'color-burn'}}/>
          </ImageBackground>
        </View>
      )
    default:
      return <View/>
  }
}