import { StyleSheet, Image, Platform, TextInput } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#800000', dark: '#300000' }}
      headerImage={
        <IconSymbol
          size={100}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
        <ThemedView style={{ padding: 16 }}>
          <ThemedText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
            Login
          </ThemedText>
            <ThemedText>Username</ThemedText>
            <TextInput style={{ padding: 8, borderColor: 'gray', borderWidth: 1, marginBottom: 16 }} />
            <ThemedText>Password</ThemedText>
            <TextInput style={{ padding: 8, borderColor: 'gray', borderWidth: 1, marginBottom: 16 }} />
            <ExternalLink href="#">Forgot Password?</ExternalLink>
        </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
