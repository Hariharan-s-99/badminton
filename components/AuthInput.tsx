import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Colors } from '../constants';

type Props = Pick<
  TextInputProps,
  'placeholder' | 'value' | 'onChangeText' | 'keyboardType' | 'autoCapitalize'
> & {
  icon: keyof typeof Ionicons.glyphMap;
  secure?: boolean;
  height?: number;
  error?: boolean;
};

export default function AuthInput({ icon, secure = false, height = 42, error = false, ...inputProps }: Props) {
  const [hidden, setHidden] = useState(secure);

  return (
    <View style={[styles.field, { height }, error && styles.fieldError]}>
      <Ionicons name={icon} size={18} color={Colors.TEXT_MUTED} />
      <TextInput
        {...inputProps}
        style={styles.input}
        placeholderTextColor={Colors.TEXT_MUTED}
        secureTextEntry={hidden}
      />
      {secure && (
        <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
          <Ionicons
            name={hidden ? 'eye-outline' : 'eye-off-outline'}
            size={18}
            color={Colors.TEXT_MUTED}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.FIELD_BORDER,
    borderRadius: 10,
    backgroundColor: Colors.BLACK,
  },
  fieldError: {
    borderColor: Colors.BRAND_RED,
  },
  input: {
    flex: 1,
    height: '100%',
    color: Colors.WHITE,
    fontSize: 16,
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
});
