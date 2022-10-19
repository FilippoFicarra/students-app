import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Platform, StyleSheet, View, ViewToken } from 'react-native';

import { AgendaCard } from '@lib/ui/components/AgendaCard';
import { Tab } from '@lib/ui/components/Tab';
import { Tabs } from '@lib/ui/components/Tabs';
import { Text } from '@lib/ui/components/Text';
import { useStylesheet } from '@lib/ui/hooks/useStylesheet';
import { useTheme } from '@lib/ui/hooks/useTheme';
import { Theme } from '@lib/ui/types/theme';

import { mapAgendaItem } from '../../../core/agenda';
import { useBottomBarAwareStyles } from '../../../core/hooks/useBottomBarAwareStyles';
import { useGetBookings } from '../../../core/queries/bookingHooks';
import { useGetExams } from '../../../core/queries/examHooks';
import { DrawerCalendar } from '../components/DrawerCalendar';

const viewabilityConfig = {
  // minimumViewTime: 100,
  viewAreaCoveragePercentThreshold: 30,
  waitForInteraction: false,
};

export const AgendaScreen = () => {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const styles = useStylesheet(createStyles);
  const examsQuery = useGetExams();
  const bookingsQuery = useGetBookings();
  const [viewedData, setViewedData] = useState<string>();

  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const [selectedEventTypes, setSelectedEventTypes] = useState<{
    [key: string]: boolean;
  }>({
    lectures: false,
    exams: false,
    bookings: false,
    deadlines: false,
  });

  const agendaItems = useMemo(() => {
    return mapAgendaItem(
      examsQuery.data?.data || [],
      bookingsQuery.data?.data || [],
      colors,
    );
  }, [examsQuery.data, bookingsQuery.data]);

  const onSelectTab = (tabName: string) => {
    setSelectedEventTypes(types => ({
      ...types,
      [tabName]: !types[tabName],
    }));
  };

  const onViewableItemsChanged = (changed: {
    viewableItems: Array<ViewToken>;
    changed: Array<ViewToken>;
  }) => {
    // console.log({ changed });
    // console.log({ viewableItems: changed.viewableItems });
    if (changed.viewableItems[0]) {
      // const viewedDate = DateTime.fromFormat(changed.viewableItems[0].key, 'dd/MM/yyyy').toISODate() || DateTime.fromJSDate(new Date()).toISODate();
    }
  };

  const onPressCalendarDay = () => {};

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  return (
    <View style={styles.container}>
      <Tabs style={styles.tabs}>
        <Tab
          selected={selectedEventTypes.lectures}
          onPress={() => onSelectTab('lectures')}
        >
          {t('Lectures')}
        </Tab>
        <Tab
          selected={selectedEventTypes.exams}
          onPress={() => onSelectTab('exams')}
        >
          {t('Exams')}
        </Tab>
        <Tab
          selected={selectedEventTypes.bookings}
          onPress={() => onSelectTab('bookings')}
        >
          {t('Bookings')}
        </Tab>
        <Tab
          selected={selectedEventTypes.deadlines}
          onPress={() => onSelectTab('deadlines')}
        >
          {t('Deadlines')}
        </Tab>
      </Tabs>
      <FlatList
        style={styles.list}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        contentContainerStyle={[
          { padding: spacing[5], paddingTop: 100 },
          bottomBarAwareStyles,
        ]}
        data={agendaItems}
        ItemSeparatorComponent={() => <View style={{ height: spacing[5] }} />}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row' }}>
            <AgendaCard
              style={styles.agendaCard}
              title={item.title}
              subtitle={item.type}
              color={item.color}
              live={item.live}
            >
              <Text variant="prose">{item.description}</Text>
            </AgendaCard>
          </View>
        )}
      />
      <DrawerCalendar onPressDay={onPressCalendarDay} />
    </View>
  );
};

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    agendaCard: { flex: 1 },
    tabs: {
      backgroundColor: colors.surface,
      borderBottomWidth: Platform.select({
        ios: StyleSheet.hairlineWidth,
      }),
      borderBottomColor: colors.divider,
      elevation: 3,
      zIndex: 1,
    },
    container: { flex: 1 },
    list: { flex: 1 },
  });
