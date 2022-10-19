import { StyleSheet } from 'react-native';

import { AgendaCard } from '@lib/ui/components/AgendaCard';
import { Col } from '@lib/ui/components/Col';
import { Row } from '@lib/ui/components/Row';
import { Text } from '@lib/ui/components/Text';
import { useStylesheet } from '@lib/ui/hooks/useStylesheet';
import { Theme } from '@lib/ui/types/theme';

import { DateTime } from 'luxon';

import { AgendaItem } from '../../../utils/types';

export interface AgendaDayProps {
  day: string;
  items: AgendaItem[];
}

export const AgendaDay = ({ day, items }: AgendaDayProps) => {
  const styles = useStylesheet(createStyles);
  const formattedDay: string = DateTime.fromISO(day).toFormat('MMMM dd');
  const weekDay: string = DateTime.fromISO(day).toFormat('EEEE');

  return (
    <Col flexStart style={styles.agendaDay} noFlex>
      <>
        <Row>
          <Text capitalize style={styles.day}>
            {formattedDay}
          </Text>
          <Text capitalize style={styles.weekDay}>
            {weekDay}
          </Text>
        </Row>
        {items.map((item, index) => (
          <AgendaCard key={index} item={item} />
        ))}
      </>
    </Col>
  );
};

const createStyles = ({ spacing, colors }: Theme) =>
  StyleSheet.create({
    agendaDay: {
      padding: 2,
    },
    day: {
      textAlign: 'left',
    },
    weekDay: {
      paddingLeft: spacing['3'],
      color: colors.primary[400],
    },
  });