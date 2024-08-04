import {CloudOff, MessagesSquare, Send, Server} from 'lucide-react-native';
import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import Button from '../components/Button';
import Header from '../components/Header';
import InfoCard from '../components/InfoCard';
import Message from '../components/Message';
import TextInput from '../components/TextInput';
import {COLORS} from '../constants/colors';
import {SIZES} from '../constants/sizes';
import AuthContext from '../contexts/AuthContext';
import {globalStyles} from '../styles';
import {Message as MessageType} from '../types/types';
import AppContext from '../contexts/AppContext';

function HomeScreen() {
  const {signedIn, userId} = useContext(AuthContext);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const {isInternetConnected, isServerConnected, socket} =
    useContext(AppContext);

  useEffect(() => {
    if (!signedIn || !socket) {
      return;
    }
    socket.emit('joinConversation');
    socket.on('joinedConversation', conversationMessages => {
      setMessages(conversationMessages);
      setLoading(false);
    });

    socket.on('message', message => {
      setMessages(prev => {
        if (message.senderId === userId) {
          const filteredMessages = prev.filter(
            m => !(m.isTemp && m.senderId === userId),
          );
          return [message, ...filteredMessages];
        } else {
          return [message, ...prev];
        }
      });
    });

    return () => {
      socket.off('message');
    };
  }, [signedIn, socket, userId]);

  const sendMessage = () => {
    if (!socket) {
      return;
    }
    setContent('');
    if (content.trim()) {
      if (!userId) {
        console.error('No user ID found');
        return;
      }
      const newMessage: MessageType = {
        id: Date.now().toString(),
        content,
        senderId: userId,
        isTemp: true,
      };

      setMessages(prev => [newMessage, ...prev]);

      console.log('Sending message...');
      socket.emit('sendMessage', content);
    }
  };

  return (
    <View style={[styles.container]}>
      <Header />
      <View style={[styles.messagesContainer]}>
        {loading ? (
          <View>
            {!isInternetConnected ? (
              <InfoCard
                title="You're Offline"
                description="It looks like you’re not connected to the internet. Please check your connection and try again"
                icon={<CloudOff size={SIZES.lIcon} color={COLORS.foreground} />}
              />
            ) : !isServerConnected ? (
              <InfoCard
                title="Server Unavailable"
                description="We're having trouble connecting to the server. Please try again later."
                icon={<Server size={SIZES.lIcon} color={COLORS.foreground} />}
              />
            ) : (
              <></>
            )}
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : messages.length === 0 ? (
          <InfoCard
            title="No Messages Yet"
            description="Your conversation is currently empty. Type your first message to start the chat!"
            icon={
              <MessagesSquare size={SIZES.lIcon} color={COLORS.foreground} />
            }
          />
        ) : (
          <FlatList
            data={messages}
            renderItem={({item, index}) => (
              <Message
                key={index}
                message={item}
                variant={item.senderId === userId ? 'primary' : 'secondary'}
              />
            )}
            keyExtractor={item => item.id}
            style={globalStyles.mainContainer}
            contentContainerStyle={{gap: SIZES.s, paddingBottom: SIZES.l}}
            inverted
          />
        )}
      </View>
      <View style={[styles.bottomContainer, globalStyles.mainContainer]}>
        <TextInput
          placeholder="Start typing..."
          enterKeyHint="send"
          value={content}
          onChangeText={setContent}
          editable={!loading}
        />
        <Button icon={SendIcon} onPress={sendMessage} disabled={loading} />
      </View>
    </View>
  );
}

const SendIcon = (color: string, size: number) => (
  <Send color={color} size={size} />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  messagesContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    gap: SIZES.s,
  },
});

export default HomeScreen;
