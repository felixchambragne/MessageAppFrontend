import {useNavigation} from '@react-navigation/native';
import {Info} from 'lucide-react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import AppContext from '../contexts/AppContext';
import AuthContext from '../contexts/AuthContext';
import {globalStyles, TEXT} from '../styles';
import convertSecondsToTime from '../utils/convertSecondsToTime';
import Button from './Button';
import {headerStyles} from './Header';

const HomeHeader = () => {
  const {signedIn} = useContext(AuthContext);
  const {socket} = useContext(AppContext);
  const [countdown, setCountdown] = useState<number>(0);
  const [countdownString, setCountdownString] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  const fetchCountdown = () => {
    if (!signedIn || !socket) {
      return;
    }

    socket.emit('getCountdown', (seconds: number) => {
      setCountdown(seconds);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!signedIn || !socket) {
      return;
    }

    fetchCountdown();

    const updateCountdown = () => {
      setCountdown(prevCountdown => {
        if (prevCountdown <= 0) {
          fetchCountdown();
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
    <View style={[headerStyles.container, globalStyles.mainContainer]}>
      <View style={headerStyles.blank} />
      <Text style={TEXT.h1}>{countdownString}</Text>
      <Button
        icon={<Info />}
        variant="secondary"
        onPress={() => navigation.navigate('About' as never)}
      />
    </View>
  );
};

export default HomeHeader;
