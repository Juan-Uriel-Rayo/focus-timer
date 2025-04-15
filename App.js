import { StyleSheet, Platform, Text, View, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Header from './src/components/Header.jsx';
import Timer from './src/components/Timer.jsx';
import { Audio } from 'expo-av';

const OPCIONES_TIEMPO = [
  { modo: "Pomodoro", duracion: 25 * 60 },
  { modo: "Descanso Corto", duracion: 5 * 60 },
  { modo: "Descanso Largo", duracion: 15 * 60 }
];

const COLORES_GRADIENTE = [
  ["#0f2027", "#203a43", "#2c5364"], //* Pomodoro
  ["#232526", "#414345"],           //* Descanso Corto
  ["#1e3c72", "#2a5298"]            //* Descanso Largo
];

const ARCHIVOS_SONIDO = [
  require('./assets/vegueta.mp3'),
  require('./assets/miCompa.mp3'),
  require('./assets/temach.mp3')
];

export default function App() {
  const [modoActual, setModoActual] = useState(0);
  const [tiempo, setTiempo] = useState(OPCIONES_TIEMPO[modoActual].duracion);
  const [activo, setActivo] = useState(false);
  const soundRefs = useRef([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    async function cargarSonidos() {
      for (let i = 0; i < ARCHIVOS_SONIDO.length; i++) {
        const { sound } = await Audio.Sound.createAsync(ARCHIVOS_SONIDO[i]);
        soundRefs.current[i] = sound;
      }
    }
    cargarSonidos();
    return () => {
      soundRefs.current.forEach((sound) => {
        if (sound) sound.unloadAsync();
      });
    };
  }, []);

  useEffect(() => {
    let intervalo = null;
    if (activo) {
      intervalo = setInterval(() => {
        setTiempo((prev) => {
          if (prev <= 1) {
            clearInterval(intervalo);
            finalizarCiclo();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [activo]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [modoActual]);

  const finalizarCiclo = async () => {
    await detenerSonido();
    const nuevoModo = modoActual === 0 ? 1 : 0;
    setModoActual(nuevoModo);
    setTiempo(OPCIONES_TIEMPO[nuevoModo].duracion);
    setActivo(false);
    if (soundRefs.current[nuevoModo]) await soundRefs.current[nuevoModo].replayAsync();
  };

  const detenerSonido = async () => {
    const sound = soundRefs.current[modoActual];
    if (sound) await sound.stopAsync();
  };

  const manejarInicioParo = async () => {
    if (activo) {
      await detenerSonido();
      setActivo(false);
    } else {
      if (soundRefs.current[modoActual]) await soundRefs.current[modoActual].replayAsync();
      setActivo(true);
    }
  };

  const cambiarModo = async (indiceModo) => {
    await detenerSonido();
    setModoActual(indiceModo);
    setTiempo(OPCIONES_TIEMPO[indiceModo].duracion);
    setActivo(false);
  };

  const reiniciar = async () => {
    await detenerSonido();
    setActivo(false);
    setTiempo(OPCIONES_TIEMPO[modoActual].duracion);
  };

  return (
    <LinearGradient colors={COLORES_GRADIENTE[modoActual]} style={styles.fondo}>
      <SafeAreaView style={styles.container}>
        <Animated.Text style={[styles.titulo, { opacity: fadeAnim }]}>Pomodoro</Animated.Text>
        <Header modoActual={modoActual} cambiarModo={cambiarModo} />
        <Timer tiempo={tiempo} />
        <TouchableOpacity
          onPress={manejarInicioParo}
          style={[styles.boton, { transform: [{ scale: scaleAnim }] }]}
          onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start()}
          onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()}
        >
          <Text style={styles.textoBoton}>{activo ? "DETENER" : "INICIAR"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={reiniciar} style={[styles.boton, { backgroundColor: "#555" }]}>
          <Text style={styles.textoBoton}>REINICIAR</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  titulo: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginVertical: 15,
  },
  boton: {
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    padding: 15,
    marginTop: 15,
    borderRadius: 15,
  },
  textoBoton: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
