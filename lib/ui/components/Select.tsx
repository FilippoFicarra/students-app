import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@lib/ui/components/Icon';
import { ListItem } from '@lib/ui/components/ListItem';
import { MenuView } from '@react-native-menu/menu';

import { IS_ANDROID, IS_IOS } from '../../../src/core/constants';

interface DropdownOption {
  id: string;
  title: string;
  image?: string;
  imageColor?: string;
  state?: 'off' | 'on' | 'mixed' | undefined;
}

interface Props {
  options: DropdownOption[];
  onSelectOption?: (id: string) => void;
  value?: string;
  label: string;
  description?: string;
  disabled?: boolean;
  disabledLabel?: string;
}

export const Select = ({
  options,
  onSelectOption,
  value,
  label,
  description,
  disabled,
  disabledLabel,
}: Props) => {
  const { t } = useTranslation();
  const displayedValue = useMemo(() => {
    return options?.find(opt => opt?.id === value)?.title;
  }, [options, value]);

  const accessibilityLabel = `${label} ${description}. ${
    disabled ? disabledLabel : ''
  }. ${!disabled ? t('createTicketScreen.doubleClickToOpenDropdown') : ''}`;

  const item = (
    <MenuView
      style={{ width: '100%' }}
      title={label}
      actions={!disabled ? options : []}
      onPressAction={({ nativeEvent: { event } }) => {
        !disabled && onSelectOption?.(event);
      }}
    >
      <ListItem
        accessibilityLabel={accessibilityLabel}
        isAction
        disabled={disabled}
        title={displayedValue || label}
        subtitle={description}
        trailingItem={IS_ANDROID ? <Icon icon={faChevronDown} /> : null}
      />
    </MenuView>
  );

  if (IS_IOS) {
    return (
      <View
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={!disabled ? 'button' : undefined}
      >
        {item}
      </View>
    );
  }

  return item;
};
