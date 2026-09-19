import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const ICONS = { fire: '🔥', star: '⭐', trophy: '🏆', book: '📘' };

export default function BadgeToast({ badge, onHide }) {
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 6 }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
      Animated.delay(2200),
      Animated.parallel([
        Animated.timing(translateY, { toValue: -120, duration: 250, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]),
    ]).start(() => onHide && onHide());
  }, []);

  if (!badge) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }], opacity }]}>
      <Text style={styles.icon}>{ICONS[badge.icon] || '🏅'}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>نشان جدید گرفتی!</Text>
        <Text style={styles.name}>{badge.name_fa}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: '#2E5CFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
  icon: { fontSize: 32, marginLeft: 10 },
  title: { color: '#fff', fontSize: 12, opacity: 0.85, textAlign: 'right' },
  name: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'right' },
});
