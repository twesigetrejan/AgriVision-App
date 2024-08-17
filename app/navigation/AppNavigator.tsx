import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import IndexPage from '../(tabs)';
import ExploreScreen from '../(tabs)/explore';
import SignUpPage from '../signup/SignUpPage';
import LoginPage from '../login';

export type RootStackParamList = {
    IndexPage: undefined;
    PostPage: undefined;
    ExploreScreen: undefined;
    SignUpPage: undefined;
    LoginPage: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="IndexPage">
                <Stack.Screen
                    name="IndexPage"
                    component={IndexPage}
                    options={{ title: 'Home' }}
                />

                <Stack.Screen
                    name="ExploreScreen"
                    component={ExploreScreen}
                    options={{ title: 'Explore' }}
                />
                <Stack.Screen
                    name="SignUpPage"
                    component={SignUpPage}
                    options={{ title: 'Sign Up' }}
                />
                <Stack.Screen
                    name="LoginPage"
                    component={LoginPage}
                    options={{ title: 'Login' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
