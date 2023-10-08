import { Brand, GoogleSignIn } from '@/components';
import { useTheme } from '@/hooks';
import React from 'react';
import { View } from 'react-native';

const Login = () => {
  const { Layout } = useTheme();

  return (
    <>
      <View style={[Layout.fill, Layout.colCenter]}>
        <Brand />
        <GoogleSignIn height={160} width={200} />
      </View>
    </>
  );
};

export default Login;
