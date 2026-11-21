import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AuthInput from '../components/AuthInput';
import AuthLogoArea from '../components/AuthLogoArea';
import Gap from '../components/Gap';
import GradientButton from '../components/GradientButton';
import HandIcon from '../components/HandIcon';
import OptionGroup from '../components/OptionGroup';
import OrDivider from '../components/OrDivider';
import SecureFooter from '../components/SecureFooter';
import WinzzBackground from '../components/WinzzBackground';
import { Colors } from '../constants';

type Level = 'beginner' | 'intermediate' | 'advance';
type Hand = 'left' | 'right';

const FIELD_HEIGHT = 38;

const LEVELS: { value: Level; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advance', label: 'Advance' },
];

const handLabel = { fontWeight: '700', letterSpacing: 2, fontSize: 13 } as const;

const HANDS = [
  {
    value: 'left' as Hand,
    label: 'LEFT',
    labelStyle: handLabel,
    icon: <HandIcon color={Colors.BRAND_RED} />,
  },
  {
    value: 'right' as Hand,
    label: 'RIGHT',
    labelStyle: handLabel,
    icon: <HandIcon color={Colors.BRAND_TEAL} />,
  },
];

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [level, setLevel] = useState<Level | null>('beginner');
  const [hand, setHand] = useState<Hand | null>(null);
  const [phone, setPhone] = useState('');

  return (
    <WinzzBackground>
      <View style={styles.screen}>
        <View style={styles.content}>
          <Pressable
            style={styles.back}
            onPress={() => router.replace('/login')}
            accessibilityRole="button"
            accessibilityLabel="Back to login"
          >
            <Ionicons name="chevron-back" size={22} color={Colors.WHITE} />
          </Pressable>

          <AuthLogoArea maxWidth="62%" />

          <Gap size={6} />
          <Text style={styles.title}>SIGN UP</Text>
          <View style={styles.titleUnderline} />

          <Gap size={12} />
          <View style={styles.fields}>
            <AuthInput
              icon="person-outline"
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              height={FIELD_HEIGHT}
            />
            <AuthInput
              icon="mail-outline"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              height={FIELD_HEIGHT}
            />
            <AuthInput
              icon="lock-closed-outline"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secure
              height={FIELD_HEIGHT}
            />
            <AuthInput
              icon="lock-closed-outline"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secure
              height={FIELD_HEIGHT}
            />
          </View>

          <Gap size={12} />
          <Text style={styles.label}>PLAYING LEVEL</Text>
          <Gap size={5} />
          <OptionGroup options={LEVELS} value={level} onChange={setLevel} />

          <Gap size={10} />
          <Text style={styles.label}>HAND</Text>
          <Gap size={5} />
          <OptionGroup options={HANDS} value={hand} onChange={setHand} />

          <Gap size={10} />
          <AuthInput
            icon="call-outline"
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            height={FIELD_HEIGHT}
          />

          <Gap size={12} />
          <GradientButton label="SIGN UP" />

          <Gap size={10} />
          <OrDivider />

          <Gap size={10} />
          <View style={styles.accountRow}>
            <Text style={styles.accountText}>Already have an account ? </Text>
            <Pressable onPress={() => router.replace('/login')}>
              <Text style={styles.loginLink}>Login</Text>
            </Pressable>
          </View>

          <Gap size={10} />
          <SecureFooter />
        </View>
      </View>
    </WinzzBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    paddingHorizontal: '10%',
    paddingTop: 12,
    paddingBottom: 14,
  },
  back: {
    position: 'absolute',
    top: 10,
    left: 12,
    zIndex: 1,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.FIELD_BORDER,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  title: {
    color: Colors.WHITE,
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  titleUnderline: {
    marginTop: 4,
    width: 20,
    height: 3,
    borderRadius: 2,
    alignSelf: 'center',
    backgroundColor: Colors.BRAND_RED,
  },
  fields: {
    gap: 7,
  },
  label: {
    color: Colors.TEXT_LIGHT,
    fontSize: 11,
    fontWeight: '500',
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  accountText: {
    color: Colors.TEXT_MUTED,
    fontSize: 12,
  },
  loginLink: {
    color: Colors.BRAND_RED,
    fontSize: 12,
    fontWeight: '700',
  },
});
