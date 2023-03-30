import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { faComments } from '@fortawesome/free-regular-svg-icons';
import {
  faChevronRight,
  faEllipsisVertical,
  faPaperclip,
} from '@fortawesome/free-solid-svg-icons';
import { Col } from '@lib/ui/components/Col';
import { Icon } from '@lib/ui/components/Icon';
import { IconButton } from '@lib/ui/components/IconButton';
import { ListItem } from '@lib/ui/components/ListItem';
import { Row } from '@lib/ui/components/Row';
import { Text } from '@lib/ui/components/Text';
import { useStylesheet } from '@lib/ui/hooks/useStylesheet';
import { useTheme } from '@lib/ui/hooks/useTheme';
import { Theme } from '@lib/ui/types/Theme';
import { TicketOverview, TicketStatus } from '@polito/api-client';
import { MenuView } from '@react-native-menu/menu';

import { IS_IOS } from '../../../core/constants';
import { useConfirmationDialog } from '../../../core/hooks/useConfirmationDialog';
import { useMarkTicketAsClosed } from '../../../core/queries/ticketHooks';
import { formatDateTime } from '../../../utils/dates';
import { parseText } from '../../../utils/html-parse';

interface Props {
  ticket: TicketOverview;
}

export const TicketListItem = ({ ticket }: Props) => {
  const { fontSizes, colors, spacing } = useTheme();
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();
  const { mutateAsync: markTicketAsClosed } = useMarkTicketAsClosed(ticket?.id);
  const confirm = useConfirmationDialog({
    message: t('tickets.closeTip'),
  });

  const markTicketAsClosedEnabled = ticket?.status !== TicketStatus.Closed;

  const actions = useMemo(() => {
    if (markTicketAsClosedEnabled) {
      return [
        {
          title: t('tickets.close'),
          color: 'red',
          image: 'trash.fill',
          imageColor: 'red',
        },
      ];
    }
    return [];
  }, [markTicketAsClosedEnabled]);

  const UnReadCount = () => {
    return (
      <Col
        justify="center"
        align="center"
        style={styles.unreadCount}
        accessible={true}
        accessibilityLabel={t('common.newReplies')}
      >
        <Text style={styles.unreadCountText}>{ticket?.unreadCount || 0}</Text>
      </Col>
    );
  };

  const onPressCloseTicket = async () => {
    if (await confirm()) {
      return markTicketAsClosed();
    }
    return Promise.reject();
  };

  const accessibilityLabel = `${parseText(ticket?.subject)} ${formatDateTime(
    ticket.updatedAt,
  )}`;

  const Item = () => {
    return (
      <ListItem
        linkTo={{
          screen: 'Ticket',
          params: { id: ticket.id },
        }}
        title={parseText(ticket?.subject)}
        subtitle={`${formatDateTime(ticket.updatedAt)} - ${parseText(
          ticket?.message,
        )}`}
        accessibilityLabel={accessibilityLabel}
        subtitleStyle={styles.listItemSubtitle}
        leadingItem={<Icon icon={faComments} size={20} />}
        trailingItem={
          <Row align="center">
            <View
              accessible={true}
              accessibilityLabel={t('common.questionWithAttachments')}
              style={{ paddingVertical: spacing[2] }}
            >
              {ticket?.hasAttachments && (
                <Icon
                  icon={faPaperclip}
                  size={20}
                  color={colors.text[400]}
                  style={
                    ticket.unreadCount === 0 && {
                      marginHorizontal: spacing[2],
                    }
                  }
                />
              )}
            </View>
            {ticket.unreadCount > 0 && <UnReadCount />}
            {IS_IOS && (
              <Icon
                icon={faChevronRight}
                color={colors.secondaryText}
                style={styles.icon}
              />
            )}
            {!IS_IOS && markTicketAsClosedEnabled && (
              <MenuView
                title={t('tickets.menuAction')}
                actions={actions}
                onPressAction={onPressCloseTicket}
                isAnchoredToRight={true}
              >
                <IconButton
                  style={styles.icon}
                  icon={faEllipsisVertical}
                  color={colors.secondaryText}
                  size={fontSizes.xl}
                />
              </MenuView>
            )}
          </Row>
        }
      />
    );
  };

  return (
    <>
      {IS_IOS ? (
        <View
          accessible
          accessibilityLabel={accessibilityLabel}
          accessibilityRole={'button'}
        >
          <MenuView
            title={t('tickets.menuAction')}
            actions={actions}
            onPressAction={onPressCloseTicket}
            shouldOpenOnLongPress={IS_IOS}
          >
            <Item />
          </MenuView>
        </View>
      ) : (
        <Item />
      )}
    </>
  );
};

const createStyles = ({ spacing, fontSizes, colors }: Theme) =>
  StyleSheet.create({
    unreadCount: {
      height: 22,
      width: 22,
      marginHorizontal: spacing[2],
      borderRadius: 22 / 2,
      backgroundColor: colors.error[500],
    },
    unreadCountText: { color: 'white' },
    listItemSubtitle: {
      fontSize: fontSizes.xs,
    },
    icon: {
      marginRight: -spacing[1],
    },
  });
