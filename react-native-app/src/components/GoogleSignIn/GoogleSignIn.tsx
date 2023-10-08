import { useState } from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTheme } from '../../hooks';
import { login } from '../../store/auth';
import { ActivityIndicator } from 'react-native';
import { Alert } from 'react-native';

type Props = {
  height?: number;
  width?: number;
};

const GoogleSignIn = ({ height, width }: Props) => {
  const { Layout, Fonts, Gutters, Colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  return (
    <>
      <View
        testID={'google-sign-in-wrapper'}
        style={{ height, width, marginTop: 32 }}
      >
        <TouchableOpacity
          style={[
            Layout.fill,
            Layout.colCenter,
            Gutters.largeVMargin,
            {
              borderRadius: 6,
              backgroundColor: Colors.blue500,
            },
          ]}
          onPress={async () => {
            GoogleSignin.configure({
              webClientId:
                '825564421794-r8ab0f6er3rmdqn3elts3idn6v3sse7q.apps.googleusercontent.com',
              iosClientId:
                '825564421794-ngo66rkssamrq3elpc9c8lobsahr0pj3.apps.googleusercontent.com',
              scopes: ['email', 'profile'],
            });
            try {
              const hasPlayService = await GoogleSignin.hasPlayServices();
              setLoading(true);
              if (hasPlayService) {
                const userInfo = await GoogleSignin.signIn();
                const res = await fetch(
                  `${process.env.API_URL}/api-auth/v1/google/`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      code: userInfo.serverAuthCode,
                    }),
                  },
                );
                const response = await res.json();
                dispatch(login(response));
              }
            } catch (error: any) {
              if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              } else if (
                error.code === statusCodes.IN_PROGRESS ||
                error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
              ) {
                Alert.alert(
                  'Error',
                  'Failed to sign in with Google. Please try again later.',
                );
              } else {
                Alert.alert(
                  'Error',
                  'Failed to sign in with Google. Please try again later. [Not Recognized]',
                );
              }
            } finally {
              setLoading(false);
            }
          }}
        >
          <View>
            <Text
              style={[
                Fonts.textSmall,
                Fonts.textBold,
                {
                  color: Colors.white,
                },
              ]}
            >
              Sign in with Google
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {loading && (
        <View
          style={[
            Layout.absolute,
            Layout.bottom0,
            Layout.top0,
            Layout.left0,
            Layout.right0,
            Layout.rowCenter,
            {
              backgroundColor: 'rgba(0,0,0,0.4)',
            },
          ]}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
    </>
  );
};

GoogleSignIn.defaultProps = {
  height: 100,
  width: 200,
};

export default GoogleSignIn;
