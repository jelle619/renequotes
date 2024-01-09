import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect, createContext } from 'react';
import { onAuthStateChanged, sendEmailVerification} from 'firebase/auth'
import { FIREBASE_AUTH } from './FirebaseConfig';

import Login from './app/screens/Login';
import { Button, Text } from 'react-native';
import Authenticated from './app/screens/Authenticated';

export const UserContext = createContext();
const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user.emailVerified) {
        setUser(user);
      } else {
        try {
          sendEmailVerification(user);
        } catch(error) {
          alert("Sending verification e-mail failed: " + error);
        } finally {
          alert("Your e-mail address isn't verified yet. Check your inbox for instructions and sign in again.");
        }
      }
    })
  })

  return (
    <UserContext.Provider value={user}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {user ?
            <Stack.Screen name="Authenticated" component={Authenticated} options={{headerShown: false}} /> :
            <Stack.Screen name="Login" component={Login} />}
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
};

// const HomeScreen = ({navigation}) => {
//   return (
//     <Button
//       title="Go to Jane's profile"
//       onPress={() =>
//         navigation.navigate('Profile', {name: 'Jane'})
//       }
//     />
//   );
// };

// const ProfileScreen = ({navigation, route}) => {
//   return <Text>This is {route.params.name}'s profile</Text>;
// };

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });