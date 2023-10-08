import { useListAttendanceQuery } from '@/services/modules/attendance';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTheme } from '../../hooks';

const History = () => {
  const { data } = useListAttendanceQuery(undefined, {
    pollingInterval: 1000,
  });

  const { Fonts, Layout } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      {/* <TextInput
        placeholder="Search"
        clearButtonMode="while-editing"
        style={{
          borderColor: '#E5E5E5',
          // backgroundColor: 'rgba(229, 229, 229, 0.1)',
          borderWidth: 1,
          borderRadius: 8,
          paddingVertical: 8,
          paddingHorizontal: 12,
          marginHorizontal: 16,
          marginVertical: 10,
        }}
      /> */}
      <ScrollView>
        {data?.map(item => (
          <View
            key={item.id}
            style={[
              Layout.row,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
              Layout.fullWidth,
              {
                borderBottomColor: '#E5E5E5',
                borderBottomWidth: 1,
                padding: 16,
              },
            ]}
          >
            <View
              style={{
                flex: 1,
                rowGap: 4,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Text style={[Fonts.textBold, Fonts.textSmall]}>
                  {item.session_id.course_id.name}
                </Text>
                <Text style={[Fonts.textRegular, Fonts.textSmall]}>
                  {new Date(item.session_id.start_time).toLocaleString()}
                </Text>
              </View>
              {/* Badge Success and Failed */}
              {/*       <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"> */}
              {item.face_recognition_status === 'SUCCESS' ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 9999,
                    backgroundColor: '#dcfce7',
                    borderWidth: 1,
                    borderColor: '#16a34a',
                  }}
                >
                  <Text
                    style={{
                      color: '#16a34a',
                      fontSize: 12,
                      fontWeight: '500',
                    }}
                  >
                    Success
                  </Text>
                </View>
              ) : item.face_recognition_status === 'FAILED' ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 9999,
                    backgroundColor: '#fee2e2',
                    borderWidth: 1,
                    borderColor: '#dc2626',
                  }}
                >
                  <Text
                    style={{
                      color: '#dc2626',
                      fontSize: 12,
                      fontWeight: '500',
                    }}
                  >
                    Failed
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 9999,
                    backgroundColor: '#fefce8',
                    borderWidth: 1,
                    borderColor: '#d97706',
                  }}
                >
                  <Text
                    style={{
                      color: '#a16207',
                      fontSize: 12,
                      fontWeight: '500',
                    }}
                  >
                    Processing
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default History;
