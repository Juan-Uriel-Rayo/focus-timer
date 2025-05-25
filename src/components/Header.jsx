import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";

const opciones = ["Pomodoro", "Descanso Corto", "Descanso Largo"];

export default function Header({ modoActual, cambiarModo, colorModo = "#2c5364" }) {
    const animacion = useRef(new Animated.Value(0)).current;

    //* Animación al cambiar modo
    useEffect(() => {
        Animated.timing(animacion, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [modoActual]);

    //* Estilo para el indicador activo
    const indicadorActivo = {
        height: 4,
        backgroundColor: colorModo,
        borderRadius: 2,
        marginTop: 5,
        transform: [
            {
                scaleX: animacion.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                }),
            },
        ],
    };

    return (
        <View style={styles.contenedor}>
            {opciones.map((etiqueta, indice) => (
                <TouchableOpacity
                    key={indice}
                    onPress={() => cambiarModo(indice)}
                    style={[
                        styles.boton,
                        modoActual === indice && styles.botonActivo,
                    ]}
                    activeOpacity={0.7}
                >
                    <Text
                        style={[
                            styles.texto,
                            modoActual === indice && styles.textoActivo,
                        ]}
                    >
                        {etiqueta}
                    </Text>

                    {/* Indicador visual */}
                    {modoActual === indice && <Animated.View style={indicadorActivo} />}
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    boton: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 6,
        alignItems: "center",
        borderRadius: 6,
        borderWidth: 3,
        borderColor: "white",
        borderTopWidth: 2,
        borderStyle: "solid",
        opacity: 0.8,
        backgroundColor: "white",
    },
    botonActivo: {
        opacity: 1,
        backgroundColor: "#1f1f1f",
    },
    texto: {
        color: "#bbb",
        fontWeight: "400",
        fontSize: 15,
    },
    textoActivo: {
        color: "#fff",
        fontWeight: "bold",
    },
});
