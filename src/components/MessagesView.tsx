import {CloudOff, MessagesSquare, Server} from 'lucide-react-native';
import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import InfoCard from '../components/InfoCard';
import Message from '../components/Message';
import MessagesView from '../components/MessagesView';
import {COLORS} from '../constants/colors';
import {SIZES} from '../constants/sizes';
import AppContext from '../contexts/AppContext';
import AuthContext from '../contexts/AuthContext';
import {usePagination} from '../hooks/usePagination';
import {decryptMessage} from '../lib/encryption';
import {globalStyles} from '../styles';
import {Message as MessageType} from '../types/types';
import {useTranslation} from 'react-i18next';

const MessagesView = () => {
  const {t} = useTranslation();
  const {signedIn, userId} = useContext(AuthContext);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [otherUserPublicKey, setOtherUserPublicKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const {isInternetConnected, isServerConnected, socket} =
    useContext(AppContext);

  const fetchMessages = async (limit: number, offset: number) => {
    console.log('Fetching messages... Limit:', limit, 'Offset:', offset);
    if (!socket) {
      return [];
    }
    socket.emit(
      'getMessages',
      limit,
      offset,
      (encryptedMessages: MessageType[]) => {
        const newMessages = encryptedMessages.map(
          (encryptedMessage: MessageType) => {
            return {
              ...encryptedMessage,
              content:
                'test  contentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontent',
            };
          },
        );
        setMessages(prev => [...prev, ...newMessages]);

        if (messages.length < limit) {
          setHasMore(false);
        }
      },
    );
    return [];
  };
  const {
    loading: isFetchingMessages,
    error,
    hasMore,
    setHasMore,
    loadMore,
  } = usePagination<MessageType>({
    fetchData: fetchMessages,
    initialLimit: 10,
  });

  useEffect(() => {
    if (!signedIn || !socket) {
      return;
    }
    socket.emit('joinConversation');
    socket.on(
      'joinedConversation',
      async ({encryptedMessages, otherUserPublicKey: publicKey}) => {
        console.log('Joined conversation');
        setOtherUserPublicKey(publicKey);
        setMessages([]);
        loadMore();
        setLoading(false);
      },
    );

    socket.on('message', async (encryptedMessage: MessageType) => {
      if (
        !encryptedMessage.cipher ||
        !encryptedMessage.iv ||
        !encryptedMessage.salt
      ) {
        return;
      }

      const receivedMessageContent = await decryptMessage(otherUserPublicKey, {
        cipher: encryptedMessage.cipher,
        iv: encryptedMessage.iv,
        salt: encryptedMessage.salt,
      });

      const message: MessageType = {
        ...encryptedMessage,
        content: receivedMessageContent,
      };

      console.log('Received message:', message);
    });

    return () => {
      socket.off('message');
    };
  }, [signedIn]);

  return (
    <View style={[styles.messagesContainer]}>
      {loading ? (
        <View>
          {!isInternetConnected ? (
            <InfoCard
              title={t('offline')}
              description={t('offline_description')}
              icon={<CloudOff size={SIZES.lIcon} color={COLORS.foreground} />}
            />
          ) : !isServerConnected ? (
            <InfoCard
              title={t('server_unavailable')}
              description={t('server_unavailable_description')}
              icon={<Server size={SIZES.lIcon} color={COLORS.foreground} />}
            />
          ) : (
            <></>
          )}
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : messages && messages.length === 0 ? (
        <InfoCard
          title={t('no_messages_yet')}
          description={t('no_messages_yet_description')}
          icon={<MessagesSquare size={SIZES.lIcon} color={COLORS.foreground} />}
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
          onEndReached={loadMore}
          onEndReachedThreshold={0.8}
          ListHeaderComponent={
            isFetchingMessages ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : null
          }
        />
      )}
    </View>
  );
};

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

export default MessagesView;
