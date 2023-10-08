import { useTheme } from '@/hooks';
import { useCreateAttendanceMutation } from '@/services/modules/attendance';
import type { AttendanceState } from '@/store/attendance';
import { clearAttendance, loadAttendance } from '@/store/attendance';
import { useIsFocused } from '@react-navigation/native';
import jwt_decode from 'jwt-decode';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import { useDispatch, useSelector } from 'react-redux';

const ScanQR = () => {
  const attendance = useSelector(
    (state: { attendance: AttendanceState }) => state.attendance,
  );
  const [isError, setIsError] = useState(false);
  const [doneQr, setDoneQr] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const dispatch = useDispatch();
  const { Layout, Images, Fonts, Colors } = useTheme();

  // API
  const [createAttendance, { isLoading }] = useCreateAttendanceMutation();

  // Vision Camera
  const isFocused = useIsFocused();

  const camera = useRef<Camera>(null);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice(doneQr ? 'front' : 'back');
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: barcodes => {
      if (!isLoading && !isError && barcodes.length > 0 && barcodes[0].value) {
        let decoded;
        try {
          decoded = jwt_decode(barcodes[0].value);
        } catch (err) {
          return;
        }

        // @ts-expect-error
        if (decoded && decoded?.session_id && decoded?.teacher_id) {
          createAttendance(barcodes[0].value as string)
            .unwrap()
            .then(res => {
              dispatch(loadAttendance({ attendance: res }));
              setDoneQr(true);
              Vibration.vibrate();
            })
            .catch(err => {
              setIsError(true);
              if (err.data && err.data.length > 0) {
                Alert.alert('Message', err.data[0], [
                  {
                    text: 'OK',
                    onPress: () => setIsError(false),
                  },
                ]);
              } else {
                console.log('err', err);
                Alert.alert(
                  'Error when scan QR code',
                  'Please try again later',
                  [
                    {
                      text: 'OK',
                      onPress: () => setIsError(false),
                    },
                  ],
                );
              }
            });
        }
      }
    },
  });

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, []);

  return (
    <>
      <View style={[Layout.fill, Layout.colCenter]}>
        {device && hasPermission ? (
          <>
            <Camera
              ref={camera}
              device={device}
              isActive={isFocused && !showResult && !isError}
              style={[StyleSheet.absoluteFill]}
              codeScanner={doneQr ? undefined : codeScanner}
              photo={doneQr}
              fps={30}
            />
            {doneQr ? (
              <View
                style={{
                  position: 'absolute',
                  bottom: 30,
                  alignSelf: 'center',
                  width: 72,
                  height: 72,
                  borderRadius: 72 / 2,
                  borderColor: 'white',
                  borderWidth: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <TouchableOpacity
                  onPress={async () => {
                    try {
                      // Take photo
                      const file = await camera.current?.takePhoto();
                      if (!file) {
                        throw new Error('Take photo error');
                      }

                      // Convert to blob
                      const result = await fetch(`file://${file.path}`);
                      const data = await result.blob();

                      // Upload to S3
                      fetch(
                        attendance.currentAttendance
                          ?.face_image_upload_url as string,
                        {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'image/jpeg',
                          },
                          body: data,
                        },
                      )
                        .then(() => {
                          // Show success
                          setDoneQr(false);
                          setShowResult(true);
                        })
                        .catch(err => {
                          console.log('Upload photo err', err);
                        });
                    } catch (err) {
                      Alert.alert('Error when upload photo');
                    }
                  }}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 52 / 2,
                    backgroundColor: '#eab308',
                  }}
                />
              </View>
            ) : (
              <>
                <Image
                  source={Images.qrPlaceholder}
                  style={{
                    width: 160,
                    height: 160,
                  }}
                />
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={showResult}
                  style={{
                    position: 'absolute',
                    margin: 0,
                  }}
                >
                  <View
                    style={[
                      {
                        backgroundColor: 'white',
                        padding: 20,
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        Fonts.textBold,
                        Fonts.textSuccess,
                        {
                          fontSize: 30,
                        },
                      ]}
                    >
                      QR code scanned
                    </Text>
                    <Text
                      style={[
                        Fonts.textRegular,
                        {
                          marginTop: 6,
                        },
                      ]}
                    >
                      {attendance.currentAttendance?.session_id.course_id.name}
                    </Text>
                    <Text style={[Fonts.textRegular]}>
                      {new Date(
                        attendance.currentAttendance?.session_id
                          .start_time as string,
                      ).toLocaleString()}
                    </Text>
                    <Text style={[Fonts.textRegular]} />
                    <TouchableOpacity
                      onPress={() => {
                        setShowResult(false);
                        dispatch(clearAttendance());
                      }}
                      style={[
                        {
                          marginTop: 20,
                          paddingVertical: 10,
                          paddingHorizontal: 20,
                          backgroundColor: Colors.primary,
                          borderRadius: 10,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          Fonts.textBold,
                          {
                            color: 'white',
                          },
                        ]}
                      >
                        Processing face image...
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              </>
            )}

            {isLoading && (
              <ActivityIndicator
                size="large"
                color={Colors.blue500}
                style={[
                  {
                    position: 'absolute',
                    alignSelf: 'center',
                  },
                ]}
              />
            )}
          </>
        ) : (
          <View style={[Layout.fill, Layout.colCenter]}>
            <Text>Have no access to camera</Text>
          </View>
        )}
      </View>
    </>
  );
};

export default ScanQR;
