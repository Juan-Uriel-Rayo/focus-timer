import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const imagenFondo = {
    uri: 'https://i.pinimg.com/736x/24/6d/82/246d82f9c5b12dd3ca68b1cbe056ef10.jpg',
    // Puedes cambiar esta URL por cualquier imagen que te guste para el fondo
};

export default function Historial() {
    const navigation = useNavigation();

    const [sesiones, setSesiones] = useState([
        { id: '1', modo: 'Pomodoro', duracion: '25:00', fecha: '2025-05-22' },
        { id: '2', modo: 'Descanso Corto', duracion: '05:00', fecha: '2025-05-22' },
        // Puedes agregar más sesiones aquí
    ]);

    return (
        <ImageBackground source={imagenFondo} style={styles.fondo} resizeMode="cover">
            <View style={styles.overlay} />

            <View style={styles.contenedor}>
                <Text style={styles.titulo}>Historial de Sesiones</Text>

                {sesiones.length === 0 ? (
                    <View style={styles.sinSesiones}>
                        <Text style={styles.textoSinSesiones}>
                            No tienes sesiones guardadas todavía.
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={sesiones}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        renderItem={({ item }) => (
                            <View style={styles.tarjetaSesion}>
                                <Text style={styles.modo}>{item.modo}</Text>
                                <Text style={styles.duracion}>Duración: {item.duracion}</Text>
                                <Text style={styles.fecha}>Fecha: {item.fecha}</Text>
                            </View>
                        )}
                    />
                )}

                <TouchableOpacity
                    style={styles.botonVolver}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Text style={styles.textoBotonVolver}>Volver</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    fondo: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)', // oscurece un poco para mejor lectura
    },
    contenedor: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
    },
    titulo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 8,
    },
    sinSesiones: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoSinSesiones: {
        fontSize: 18,
        color: '#ddd',
        fontStyle: 'italic',
    },
    tarjetaSesion: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 58,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        marginHorizontal: 10,
        marginVertical: 5,
    },
    modo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
    },
    duracion: {
        fontSize: 16,
        color: '#555',
        marginTop: 4,
    },
    fecha: {
        fontSize: 14,
        color: '#777',
        marginTop: 2,
    },
    botonVolver: {
        backgroundColor: '#2c5364',
        paddingVertical: 14,
        borderRadius: 30,
        marginTop: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5,
    },
    textoBotonVolver: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});