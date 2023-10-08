import React from 'react';
import { DimensionValue, Image, Text, View } from 'react-native';
import { useTheme } from '../../hooks';

type Props = {
  height?: DimensionValue;
  width?: DimensionValue;
  mode?: 'contain' | 'cover' | 'stretch' | 'repeat' | 'center';
};

const Brand = ({ height, width, mode }: Props) => {
  const { Layout, Images, Fonts, Gutters } = useTheme();

  return (
    <View testID={'brand-img-wrapper'} style={{ height, width }}>
      <Image
        testID={'brand-img'}
        style={Layout.fullSize}
        source={Images.logo}
        resizeMode={mode}
      />
      <Text
        style={[
          Fonts.textCenter,
          Fonts.textBold,
          Gutters.smallTMargin,
          Fonts.textRegular,
        ]}
      >
        UCF Here
      </Text>
    </View>
  );
};

Brand.defaultProps = {
  height: 200,
  width: 200,
  mode: 'contain',
};

export default Brand;
