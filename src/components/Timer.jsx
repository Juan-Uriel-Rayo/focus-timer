import { Text, View, StyleSheet, Animated, Platform } from "react-native";
import { useEffect, useRef, useState } from "react";

export default function Timer({ tiempo, colorModo = "#5414" }) {
    const [showWarning, setShowWarning] = useState(false);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    //* Efecto de pulso en últimos 10 segundos
    useEffect(() => {
        if (tiempo <= 10 && tiempo > 0) {
            setShowWarning(true);
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 500,
                        useNativeDriver: true
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 0.9,
                        duration: 500,
                        useNativeDriver: true
                    })
                ])
            ).start();
        } else {
            setShowWarning(false);
            pulseAnim.setValue(1);
        }
    }, [tiempo]);

    //* Animación normal al cambiar tiempo
    useEffect(() => {
        Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 100,
            useNativeDriver: true,
        }).start(() => {
            Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }).start();
        });
    }, [tiempo]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
    };

    return (
        <Animated.View style={[
            styles.contenedor,
            showWarning && styles.warningContainer,
            { transform: [{ scale: pulseAnim }] }
        ]}>
            <Text style={[
                styles.tiempo,
                { color: showWarning ? "#ff5555" : colorModo }
            ]}>
                {formatTime(tiempo)}
            </Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 0.3,
        justifyContent: 'center',
        backgroundColor: "rgba(30, 30, 30, 0.7)",
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: 'white',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            },
            android: {
                elevation: 52,
            },
            web: {
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            },
        }),
    },
    warningContainer: {
        backgroundColor: "rgba(70, 30, 30, 0.7)",
        borderColor: "#ff5555",
    },
    tiempo: {
        fontSize: 72,
        fontWeight: "bold",
        textAlign: "center",
        fontVariant: ["tabular-nums"],
        textShadowColor: "#000",
        textShadowOffset: { width: 2, height: 2 },
    },
});