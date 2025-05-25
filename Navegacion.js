// Navigation.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/Screen/HomeScreen.js';
import Historial from './src/Screen/Historial.js';


const Stack = createNativeStackNavigator();

export default function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Inicio" component={HomeScreen} />
                <Stack.Screen name="Historial" component={Historial} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
