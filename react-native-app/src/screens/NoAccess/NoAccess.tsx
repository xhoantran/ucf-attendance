import { logout } from '@/store/auth';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Brand } from '../../components';
import { useTheme } from '../../hooks';

const NoAccess = () => {
  const { Layout, Fonts, Gutters, Colors } = useTheme();
  const dispatch = useDispatch();

  return (
    <>
      <View style={[Layout.fill, Layout.colCenter]}>
        <Brand />
        <View style={[Layout.colCenter, Gutters.largeVMargin]}>
          <Text style={[Fonts.textSmall, Fonts.textCenter]}>
            You don't have access to this application. Please contact your
            administrator.
          </Text>

          <TouchableOpacity
            style={[
              Gutters.smallVMargin,
              {
                borderRadius: 6,
                backgroundColor: Colors.blue500,
                padding: 8,
              },
            ]}
            onPress={() => dispatch(logout())}
          >
            <Text
              style={[
                Fonts.textSmall,
                Fonts.textBold,
                {
                  color: Colors.white,
                  paddingHorizontal: 16,
                },
              ]}
            >
              Sign out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default NoAccess;
