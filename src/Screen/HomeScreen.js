import {
  StyleSheet,
  Platform,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  ImageBackground,
} from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import Timer from '../components/Timer';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

const OPCIONES_TIEMPO = [
  { modo: 'Pomodoro', duracion: 25 * 60 },
  { modo: 'Descanso Corto', duracion: 5 * 60 },
  { modo: 'Descanso Largo', duracion: 15 * 60 },
];

const IMAGENES_FONDO = [
  'https://i.pinimg.com/736x/57/37/0c/57370c5abfac57b59e8be5ac03442538.jpg', // Pomodoro
  'https://i.pinimg.com/736x/b6/b4/85/b6b485cbabb34757a19bd26cc61ca8bb.jpg', // Descanso Corto
  'https://i.pinimg.com/736x/8d/2f/fa/8d2ffa5ab6c406165e73df03b961158c.jpg', // Descanso Largo
];

const ARCHIVOS_SONIDO = [
  require('../assets/vegueta.mp3'),  // Pomodoro
  require('../assets/temach.mp3'),   // Descanso Corto
  require('../assets/miCompa.mp3'),  // Descanso Largo
];

export default function HomeScreen() {
  const navigation = useNavigation();
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
    const nuevoModo = (modoActual + 1) % OPCIONES_TIEMPO.length;
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

  const contenido = (
    <SafeAreaView style={styles.container}>
      <Animated.Text style={[styles.titulo, { opacity: fadeAnim }]}>
        {OPCIONES_TIEMPO[modoActual].modo}
      </Animated.Text>

      <Header modoActual={modoActual} cambiarModo={cambiarModo} />
      <Timer tiempo={tiempo} />

      <TouchableOpacity
        onPress={manejarInicioParo}
        style={[styles.boton, { transform: [{ scale: scaleAnim }] }]}
        onPressIn={() =>
          Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start()
        }
        onPressOut={() =>
          Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()
        }
      >
        <Text style={styles.textoBoton}>{activo ? 'DETENER' : 'INICIAR'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={reiniciar} style={[styles.boton, { backgroundColor: '#2666' }]}>
        <Text style={styles.textoBoton}>REINICIAR</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Historial')}
        style={[styles.boton, { backgroundColor: 'white' }]}
      >
        <Text style={styles.textoBoton}>Ir al Historial</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  return (
    <ImageBackground
      source={{ uri: IMAGENES_FONDO[modoActual] }}
      style={styles.fondo}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.0)']}
        style={StyleSheet.absoluteFill}
      />
      {contenido}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  titulo: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 15,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  boton: {
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    padding: 15,
    marginTop: 15,
    borderRadius: 15,
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
