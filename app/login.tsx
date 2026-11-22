import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AuthInput from '../components/AuthInput';
import AuthLogoArea from '../components/AuthLogoArea';
import FacebookIcon from '../components/FacebookIcon';
import GoogleIcon from '../components/GoogleIcon';
import GradientButton from '../components/GradientButton';
import OrDivider from '../components/OrDivider';
import SecureFooter from '../components/SecureFooter';
import WinzzBackground from '../components/WinzzBackground';
import { Colors } from '../constants';

export default function LoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleLogin = () => {
    setSubmitted(true);
    if (identifier.trim() && password) {
      router.replace('/home');
    }
  };

  return (
    <WinzzBackground>
      <View style={styles.screen}>
        <View style={styles.content}>
          <AuthLogoArea />

          <Text style={styles.welcome}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to continue your journey</Text>

          <View style={styles.tabs}>
            <View style={[styles.tab, styles.tabActive]}>
              <FontAwesome5 name="user" solid size={15} color={Colors.BRAND_RED} />
              <Text style={[styles.tabText, { color: Colors.BRAND_RED }]}>LOGIN</Text>
            </View>
            <Pressable style={styles.tab} onPress={() => router.replace('/signup')}>
              <FontAwesome5 name="user-plus" solid size={15} color={Colors.TEXT_MUTED} />
              <Text style={styles.tabText}>SIGN UP</Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            <AuthInput
              icon="mail-outline"
              placeholder="Email or Mobile Number"
              value={identifier}
              onChangeText={setIdentifier}
              keyboardType="email-address"
              autoCapitalize="none"
              error={submitted && !identifier.trim()}
            />
            <AuthInput
              icon="lock-closed-outline"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secure
              error={submitted && !password}
            />
          </View>

          <View style={styles.optionsRow}>
            <Pressable style={styles.remember} onPress={() => setRemember((r) => !r)}>
              <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
                {remember && <Ionicons name="checkmark" size={14} color={Colors.WHITE} />}
              </View>
              <Text style={styles.rememberText}>Remember Me</Text>
            </Pressable>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </View>

          <View style={styles.loginButton}>
            <GradientButton label="LOGIN" onPress={handleLogin} />
          </View>

          <View style={styles.or}>
            <OrDivider />
          </View>

          <Text style={styles.loginWith}>Login with</Text>
          <View style={styles.socialRow}>
            <View style={styles.socialButton}>
              <GoogleIcon />
            </View>
            <View style={styles.socialButton}>
              <FacebookIcon />
            </View>
            <View style={styles.socialButton}>
              <Ionicons name="logo-apple" size={26} color={Colors.WHITE} />
            </View>
          </View>

          <View style={styles.footer}>
            <SecureFooter />
          </View>
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
    paddingHorizontal: '9%',
    paddingTop: 12,
    paddingBottom: 16,
  },
  welcome: {
    marginTop: 16,
    color: Colors.WHITE,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 3,
    color: Colors.WHITE,
    fontSize: 12,
    textAlign: 'center',
  },
  tabs: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 6,
    borderBottomWidth: 2,
    borderBottomColor: Colors.DIVIDER,
  },
  tabActive: {
    borderBottomColor: Colors.BRAND_RED,
  },
  tabText: {
    color: Colors.WHITE,
    fontSize: 13,
  },
  form: {
    marginTop: 12,
    gap: 9,
  },
  optionsRow: {
    marginTop: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  remember: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.TEXT_MUTED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.BRAND_RED,
    borderColor: Colors.BRAND_RED,
  },
  rememberText: {
    color: Colors.WHITE,
    fontSize: 11,
  },
  forgot: {
    color: Colors.BRAND_RED,
    fontSize: 11,
  },
  loginButton: {
    marginTop: 12,
  },
  or: {
    marginTop: 10,
  },
  loginWith: {
    marginTop: 10,
    color: Colors.TEXT_MUTED,
    fontSize: 11,
    textAlign: 'center',
  },
  socialRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 21,
  },
  socialButton: {
    width: 49,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.FIELD_BORDER,
    backgroundColor: Colors.BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    marginTop: 12,
  },
});
