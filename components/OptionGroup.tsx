import { Fragment, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextStyle, View } from 'react-native';
import { Colors } from '../constants';

type Option<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
  labelStyle?: TextStyle;
};

type Props<T extends string> = {
  options: Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
};

export default function OptionGroup<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.group}>
      {options.map((option, i) => {
        const selected = option.value === value;
        const hideDivider = selected || options[i - 1]?.value === value;
        return (
          <Fragment key={option.value}>
            {i > 0 && <View style={[styles.divider, hideDivider && styles.dividerHidden]} />}
            <Pressable
              onPress={() => onChange(option.value)}
              style={[styles.option, selected && styles.selected]}
            >
              {option.icon}
              <Text style={[styles.label, option.labelStyle, selected && styles.labelSelected]}>
                {option.label}
              </Text>
            </Pressable>
          </Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.FIELD_BORDER,
    borderRadius: 10,
    backgroundColor: Colors.SURFACE_DARK,
  },
  option: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 10,
  },
  selected: {
    borderColor: Colors.BRAND_RED,
    backgroundColor: Colors.SELECTED_FILL,
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: Colors.FIELD_BORDER,
  },
  dividerHidden: {
    backgroundColor: 'transparent',
  },
  label: {
    color: Colors.WHITE,
    fontSize: 12,
  },
  labelSelected: {
    color: Colors.BRAND_RED,
  },
});
