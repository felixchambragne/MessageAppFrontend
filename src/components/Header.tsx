import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {globalStyles, TEXT} from '../styles';
import {COLORS} from '../constants/colors';
import AuthContext from '../contexts/AuthContext';
import convertSecondsToTime from '../utils/convertSecondsToTime';
import AppContext from '../contexts/AppContext';

const Header = () => {
  const {signedIn} = useContext(AuthContext);
  const {socket} = useContext(AppContext);
  const [countdown, setCountdown] = useState<number>(0);
  const [countdownString, setCountdownString] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!signedIn || !socket) {
      return;
    }

    socket.emit('getCountdown', (seconds: number) => {
      setCountdown(seconds);
      setLoading(false);
    });

    const updateCountdown = () => {
      setCountdown(prevCountdown => {
        if (prevCountdown <= 0) {
          return 0;
        }
        return prevCountdown - 1;
      });
    };

    const intervalId = setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [signedIn, socket]);

  useEffect(() => {
    setCountdownString(loading ? '' : convertSecondsToTime(countdown));
  }, [countdown, loading]);

  return (
    <View style={[styles.container, globalStyles.mainContainer]}>
      <Text style={TEXT.h1}>{countdownString}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
});

export default Header;
