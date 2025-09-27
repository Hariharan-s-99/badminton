import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get('window');

interface Sport {
    id: string;
    name: string;
    emoji: string;
    gradient: [string, string];
}

const sports: Sport[] = [
    {
        id: 'badminton',
        name: 'Badminton',
        emoji: '🏸',
        // REFINED: Dusker, darker red gradient for a premium, subtle effect
        gradient: ['#3D1014', '#8B0000'] 
    },
    {
        id: 'tennis',
        name: 'Tennis',
        emoji: '🎾',
        // REFINED: Even darker gray for a more recessive locked state
        gradient: ['#202020', '#404040'] 
    },
    {
        id: 'table-tennis',
        name: 'Table Tennis',
        emoji: '🏓',
        // REFINED: Even darker gray for a more recessive locked state
        gradient: ['#202020', '#404040'] 
    }
];

export default function SportSelection() {
    const handleSportPress = (sport: Sport) => {
        if (sport.id === 'badminton') {
            console.log(`Selected sport: ${sport.name}`);
            router.push('./badminton');
        } else {
            console.log(`${sport.name} is locked - Coming Soon!`);
        }
    };

    const isLocked = (sportId: string) => sportId !== 'badminton';

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.header}>
                <ThemedText type="title" style={styles.title}>
                    Pick Your Game
                </ThemedText>
                <View style={styles.divider} />
            </ThemedView>

            <View style={styles.sportsContainer}>
                {sports.map((sport, index) => (
                    <TouchableOpacity
                        key={sport.id}
                        style={[
                            styles.sportButton, 
                            { marginTop: index * 20 },
                            isLocked(sport.id) && styles.lockedButton
                        ]}
                        onPress={() => handleSportPress(sport)}
                        activeOpacity={isLocked(sport.id) ? 0.5 : 0.9}
                        disabled={isLocked(sport.id)}
                    >
                        <LinearGradient
                            colors={sport.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientButton}
                        >
                            <View style={styles.buttonContent}>
                                <Text style={[
                                    styles.emoji,
                                    isLocked(sport.id) ? styles.lockedText : styles.activeText 
                                ]}>
                                    {sport.emoji}
                                </Text>
                                <Text style={[
                                    styles.sportName,
                                    isLocked(sport.id) ? styles.lockedText : styles.activeText 
                                ]}>
                                    {sport.name}
                                </Text>
                                <View style={[
                                    styles.arrow,
                                    isLocked(sport.id) ? styles.lockedArrow : styles.activeArrow 
                                ]}>
                                    <Text style={[
                                        styles.arrowText,
                                        isLocked(sport.id) ? styles.lockedText : styles.activeText 
                                    ]}>
                                        {isLocked(sport.id) ? '🔒' : '→'}
                                    </Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>More sports coming soon!</Text>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingHorizontal: 24,
    },
    header: {
        paddingTop: 40,
        paddingBottom: 40,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    title: {
        textAlign: 'center',
        color: '#FFFFFF', 
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    divider: {
        width: 60,
        height: 3,
        backgroundColor: '#8B0000', // Matches the darkest red effect
        borderRadius: 2,
    },
    sportsContainer: {
        flex: 1,
        paddingVertical: 20,
    },
    sportButton: {
        marginBottom: 16,
        borderRadius: 25,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 12,
    },
    gradientButton: {
        paddingVertical: 24,
        paddingHorizontal: 32,
        borderRadius: 25,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    emoji: {
        fontSize: 32,
        marginRight: 16,
    },
    sportName: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
    },
    arrow: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        paddingBottom: 40,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.7,
    },
    // --- ACTIVE (UNLOCKED) STYLES ---
    activeText: {
        color: '#FFFFFF', // White text on the dark button
    },
    activeArrow: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle white arrow circle on the dark button
    },
    // --- LOCKED STYLES ---
    lockedButton: {
        opacity: 0.7, 
    },
    lockedText: {
        color: '#999999', // Medium gray text for visibility on the very dark gray gradient
    },
    lockedArrow: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // Even more subtle white arrow circle for inactive state
    },
});