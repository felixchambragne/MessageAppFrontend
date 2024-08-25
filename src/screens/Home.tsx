import BottomSheet from '@gorhom/bottom-sheet';
import {CloudOff, MessagesSquare, Send, Server} from 'lucide-react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import BottomSheetContainer from '../components/BottomSheetContainer';
import Button from '../components/Button';
import HomeHeader from '../components/HomeHeader';
import InfoCard from '../components/InfoCard';
import Message from '../components/Message';
import NewContactBottomSheet from '../components/NewContactBottomSheet';
import TextInput from '../components/TextInput';
import {COLORS} from '../constants/colors';
import {SIZES} from '../constants/sizes';
import AppContext from '../contexts/AppContext';
import AuthContext from '../contexts/AuthContext';
import {usePagination} from '../hooks/usePagination';
import {
  computePrivateSessionKey,
  decryptMessage,
  encryptMessage,
} from '../lib/encryption';
import {globalStyles} from '../styles';
import {Message as MessageType} from '../types/types';

export default function HomeScreen() {
  const {t} = useTranslation();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const {signedIn, userId} = useContext(AuthContext);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [privateSessionKey, setPrivateSessionKey] = useState<string>('');
  const [inputMessageContent, setInputMessageContent] = useState<string>('');
  const [loadingJoin, setLoadingJoin] = useState<boolean>(true);
  const {isInternetConnected, isServerConnected, socket} =
    useContext(AppContext);

  const fetchMessages = () => {
    console.log('Fetching messages... Limit:', limit, 'Offset:', offset);
    if (!socket) {
      return;
    }
    socket.emit(
      'getMessages',
      limit,
      offset,
      async (encryptedMessages: MessageType[]) => {
        const newMessages = await Promise.all(
          encryptedMessages.map(async encryptedMessage => {
            const receivedMessageContent = await decryptMessage(
              {
                cipher: encryptedMessage.cipher,
                iv: encryptedMessage.iv,
                salt: encryptedMessage.salt,
              },
              privateSessionKey,
            );

            const message: MessageType = {
              ...encryptedMessage,
              content: receivedMessageContent,
            };

            return message;
          }),
        );

        setMessages(prev => [...prev, ...newMessages]);
        if (encryptedMessages.length < limit) {
          setHasMore(false);
        }
        setLoadingMessages(false);
      },
    );
  };

  const {
    loading: loadingMessages,
    setLoading: setLoadingMessages,
    hasMore,
    setHasMore,
    offset,
    setOffset,
    limit,
    loadMore,
  } = usePagination({
    fetchData: fetchMessages,
    initialLimit: 15,
  });

  useEffect(() => {
    if (!signedIn || !socket) {
      return;
    }

    socket.on('conversationsDeleted', () => {
      console.log('Conversations deleted');
      setInputMessageContent('');
      setMessages([]);
      setOffset(0);
      setHasMore(true);
      socket.emit('joinConversation');
    });

    socket.emit('joinConversation');
    socket.on(
      'joinedConversation',
      async ({
        otherUserPublicKey: publicKey,
        isNewConversation,
      }: {
        otherUserPublicKey: string;
        isNewConversation: boolean;
      }) => {
        console.log('Joined conversation');

        if (isNewConversation) {
          bottomSheetRef.current?.expand();
        }

        const sessionKey = await computePrivateSessionKey(publicKey);
        setPrivateSessionKey(sessionKey);
        setLoadingJoin(false);
      },
    );

    if (privateSessionKey) {
      loadMore();
    }

    socket.on('message', async (encryptedMessage: MessageType) => {
      console.log('privateSessionKey:', privateSessionKey);
      if (!privateSessionKey) {
        return;
      }
      const receivedMessageContent = await decryptMessage(
        {
          cipher: encryptedMessage.cipher,
          iv: encryptedMessage.iv,
          salt: encryptedMessage.salt,
        },
        privateSessionKey,
      );
      const message: MessageType = {
        ...encryptedMessage,
        content: receivedMessageContent,
      };
      setMessages(prev => [message, ...prev]);
      setOffset(prevOffset => prevOffset + 1);
      console.log('Received message:', message.content);
    });

    return () => {
      socket.off('message');
    };
  }, [signedIn, privateSessionKey]);

  const sendMessage = async () => {
    if (!socket || !userId) {
      return;
    }
    setInputMessageContent('');
    if (inputMessageContent.trim()) {
      const encryptedMessage = await encryptMessage(
        inputMessageContent,
        privateSessionKey,
      );
      console.log('Sending message:', inputMessageContent);
      socket.emit('sendMessage', encryptedMessage);
    }
  };

  return (
    <View style={[styles.container]}>
      <HomeHeader />
      <View style={[styles.messagesContainer]}>
        {loadingJoin ? (
          <>
            {!isInternetConnected ? (
              <InfoCard
                title={t('offline')}
                loading={true}
                description={t('offline_description')}
                icon={<CloudOff size={SIZES.lIcon} color={COLORS.foreground} />}
              />
            ) : !isServerConnected ? (
              <InfoCard
                title={t('server_unavailable')}
                loading={true}
                description={t('server_unavailable_description')}
                icon={<Server size={SIZES.lIcon} color={COLORS.foreground} />}
              />
            ) : (
              <ActivityIndicator size="large" color={COLORS.primary} />
            )}
          </>
        ) : privateSessionKey ? (
          <>
            {messages.length === 0 && !loadingMessages ? (
              <InfoCard
                title={t('no_messages_yet')}
                description={t('no_messages_yet_description')}
                icon={
                  <MessagesSquare
                    size={SIZES.lIcon}
                    color={COLORS.foreground}
                  />
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
                contentContainerStyle={styles.flatListContentContainer}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  hasMore ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  ) : null
                }
                inverted
              />
            )}
          </>
        ) : (
          <></>
        )}
      </View>
      <View style={[styles.bottomContainer, globalStyles.mainContainer]}>
        <TextInput
          placeholder={t('input_message_placeholder')}
          enterKeyHint="send"
          value={inputMessageContent}
          onChangeText={setInputMessageContent}
          editable={!loadingJoin}
          onSubmitEditing={sendMessage}
        />
        <Button icon={<Send />} onPress={sendMessage} disabled={loadingJoin} />
      </View>
      <BottomSheetContainer ref={bottomSheetRef}>
        <NewContactBottomSheet />
      </BottomSheetContainer>
    </View>
  );
}

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
  flatListContentContainer: {
    gap: SIZES.s,
    paddingBottom: SIZES.l,
  },
  bottomContainer: {
    flexDirection: 'row',
    gap: SIZES.s,
  },
});
