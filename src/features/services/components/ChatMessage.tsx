import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ChatBubble } from '@lib/ui/components/ChatBubble';
import { Text } from '@lib/ui/components/Text';
import { useStylesheet } from '@lib/ui/hooks/useStylesheet';
import { Theme } from '@lib/ui/types/Theme';
import { TicketReply } from '@polito/api-client/models/TicketReply';

import { formatDateTime } from '../../../utils/dates';
import { TextMessage } from './TextMessage';
import { TicketAttachmentChip } from './TicketAttachmentChip';

interface ChatMessageProps {
  received: boolean;
  message: TicketReply;
  ticketId: number;
}

export const ChatMessage = ({
  received,
  message,
  ticketId,
}: ChatMessageProps) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const hasAttachment = message.attachments?.length > 0;

  const Attachments = () => {
    if (hasAttachment) {
      return (
        <View style={styles.attachmentContainer}>
          {message.attachments.map((item, index) => {
            return (
              <TicketAttachmentChip
                key={index}
                attachment={item}
                ticketId={ticketId}
                replyId={message.id}
              />
            );
          })}
        </View>
      );
    }
    return null;
  };

  const date = formatDateTime(message.createdAt);
  const agentResponse =
    message?.isFromAgent && message.agentId
      ? `${t('ticketScreen.agentResponseFromOperator')}: ${message.agentId}`
      : `${t('ticketScreen.agentResponse')}`;
  const accessibilityLabel = `${date}. ${
    message?.isFromAgent ? agentResponse : t('ticketScreen.yourResponse')
  }: ${message.message.trim() ?? ''}`;

  return (
    <ChatBubble
      direction={received ? 'incoming' : 'outgoing'}
      time={message.createdAt}
      style={styles.bubbleContainer}
    >
      <View accessible={true} accessibilityLabel={accessibilityLabel}>
        {!!message?.isFromAgent && message.agentId && (
          <Text style={styles.agentText}>
            #{t('common.agent')} {message.agentId}
          </Text>
        )}
        <TextMessage message={message.message?.trim() ?? ''} />
      </View>
      <Attachments />
    </ChatBubble>
  );
};

const createStyles = ({ spacing, colors }: Theme) =>
  StyleSheet.create({
    agentText: {
      color: colors.primary[200],
      marginBottom: spacing[2],
    },
    bubbleContainer: {
      marginHorizontal: spacing[5],
    },
    attachmentContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  });
