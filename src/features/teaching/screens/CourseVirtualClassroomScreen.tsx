import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import { PersonListItem } from '@lib/ui/components/PersonListItem';
import { RefreshControl } from '@lib/ui/components/RefreshControl';
import { SectionList } from '@lib/ui/components/SectionList';
import { VideoPlayer } from '@lib/ui/components/VideoPlayer';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { EventDetails } from '../../../core/components/EventDetails';
import { useRefreshControl } from '../../../core/hooks/useRefreshControl';
import { useGetCourseVirtualClassrooms } from '../../../core/queries/courseHooks';
import { useGetPerson } from '../../../core/queries/peopleHooks';
import { formatDateWithTimeIfNotNull } from '../../../utils/dates';
import { TeachingStackParamList } from '../components/TeachingNavigator';

type Props = NativeStackScreenProps<
  TeachingStackParamList,
  'CourseVirtualClassroom'
>;

export const CourseVirtualClassroomScreen = ({ route }: Props) => {
  const { courseId, lectureId } = route.params;
  const { t } = useTranslation();
  const virtualClassroomQuery = useGetCourseVirtualClassrooms(courseId);
  const lecture = virtualClassroomQuery.data?.data.find(
    l => l.id === lectureId,
  );
  const teacherQuery = useGetPerson(lecture.teacherId);
  const refreshControl = useRefreshControl(virtualClassroomQuery, teacherQuery);

  const accessibilityLabel = [
    lecture.title ?? '',
    t('courseVirtualClassroomScreen.title'),
    formatDateWithTimeIfNotNull(
      lecture.createdAt,
      'dd MMMM yyyy',
      'dd MMMM yyyy HH:mm',
    ),
  ]
    .filter(i => !!i)
    .join(', ');

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl {...refreshControl} />}
    >
      <VideoPlayer videoUrl={lecture.videoUrl} coverUrl={lecture.coverUrl} />
      <EventDetails
        accessible
        accessibilityLabel={accessibilityLabel}
        title={lecture.title}
        type={t('courseVirtualClassroomScreen.title')}
        time={formatDateWithTimeIfNotNull(lecture.createdAt)}
      />
      <SectionList loading={teacherQuery.isLoading}>
        {teacherQuery.data && (
          <PersonListItem
            person={teacherQuery.data?.data}
            subtitle={t('common.teacher')}
          />
        )}
      </SectionList>
    </ScrollView>
  );
};
