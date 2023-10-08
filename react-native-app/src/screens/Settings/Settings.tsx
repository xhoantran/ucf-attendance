import { AuthState, logout } from '@/store/auth';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../hooks';
import { changeTheme } from '@/store/theme';

const UserInfo = () => {
  const auth = useSelector((state: { auth: AuthState }) => state.auth);

  const { Fonts, Layout } = useTheme();
  const dispatch = useDispatch();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View
          style={[
            Layout.row,
            Layout.alignItemsCenter,
            Layout.fullWidth,
            {
              backgroundColor: '#F5F5F5',
              borderBottomColor: '#E5E5E5',
              borderBottomWidth: 1,
              padding: 16,
            },
          ]}
        >
          <Ionicons name="person-circle-outline" size={40} />
          <View
            style={{
              marginLeft: 16,
            }}
          >
            <Text style={[Fonts.textBold, Fonts.textSmall]}>
              {auth.user?.name}
            </Text>
            <Text>{auth.user?.email}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[
            Layout.row,
            Layout.alignItemsCenter,
            Layout.fullWidth,
            {
              backgroundColor: '#F5F5F5',
              borderBottomColor: '#E5E5E5',
              borderBottomWidth: 1,
              padding: 16,
            },
          ]}
          onPress={() =>
            dispatch(changeTheme({ theme: 'default', darkMode: false }))
          }
        >
          <Ionicons name="bulb-outline" size={40} />
          <Text style={{ marginLeft: 16 }}>Change theme</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            Layout.row,
            Layout.alignItemsCenter,
            Layout.fullWidth,
            {
              backgroundColor: '#F5F5F5',
              borderBottomColor: '#E5E5E5',
              borderBottomWidth: 1,
              padding: 16,
            },
          ]}
          onPress={() => dispatch(logout())}
        >
          <Ionicons name="exit-outline" size={40} />
          <Text style={{ marginLeft: 16 }}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default UserInfo;
