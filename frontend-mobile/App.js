import React,{useEffect,useState} from 'react';
import {ActivityIndicator,Image,StatusBar,StyleSheet,Text,View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Provider,useApp} from './src/context/AppContext';
import Auth from './src/screens/Auth';
import Setup from './src/screens/Setup';
import Interests from './src/screens/Interests';
import {Home,Explore} from './src/screens/Discover';
import Detail from './src/screens/Detail';
import MyEvents from './src/screens/MyEvents';
import {Organizer,Publish} from './src/screens/Organizer';
import Profile from './src/screens/Profile';
import {colors} from './src/theme';
const Stack=createNativeStackNavigator(),Tab=createBottomTabNavigator();
function Favorites(props){return <MyEvents {...props} kind="favorites"/>;}
function Registrations(props){return <MyEvents {...props} kind="registrations"/>;}
function MainTabs(){const {user}=useApp();const organizer=user?.role==='ORGANIZER';const settings={headerShown:false,tabBarActiveTintColor:colors.green,tabBarInactiveTintColor:'#879D8B',tabBarLabelStyle:{fontSize:10,fontWeight:'800'},tabBarStyle:{height:65,paddingTop:5,paddingBottom:7,borderTopColor:'#e5efe6',backgroundColor:'#fff'},tabBarIconStyle:{marginBottom:0}};
 const icon=emoji=>({color})=><Text style={{fontSize:23,color}}>{emoji}</Text>;
 return <Tab.Navigator screenOptions={settings}>{organizer?<>
  <Tab.Screen name="Painel" component={Organizer} options={{tabBarIcon:icon('▤')}}/>
  <Tab.Screen name="Explorar" component={Explore} options={{tabBarIcon:icon('⌕')}}/>
  <Tab.Screen name="Perfil" component={Profile} options={{tabBarIcon:icon('☺')}}/>
 </>:<>
  <Tab.Screen name="Início" component={Home} options={{tabBarIcon:icon('⌂')}}/>
  <Tab.Screen name="Explorar" component={Explore} options={{tabBarIcon:icon('⌕')}}/>
  <Tab.Screen name="Favoritos" component={Favorites} options={{tabBarIcon:icon('♡')}}/>
  <Tab.Screen name="Inscrições" component={Registrations} options={{tabBarIcon:icon('▦')}}/>
  <Tab.Screen name="Perfil" component={Profile} options={{tabBarIcon:icon('☺')}}/>
 </>}</Tab.Navigator>;
}
function Splash(){return <View style={styles.splash}><Image style={styles.logo} source={require('./src/assets/logo.png')}/><Text style={styles.brand}>Elder<Text style={{color:'#ADE8C1'}}>Connect</Text></Text><Text style={styles.slogan}>Experiências que aproximam</Text><ActivityIndicator size="small" color="#c2e9c9" style={{marginTop:20}}/></View>}
function Root(){const {user,booting}=useApp();const [opening,setOpening]=useState(true);useEffect(()=>{const t=setTimeout(()=>setOpening(false),1050);return ()=>clearTimeout(t);},[]);if(opening||booting)return <Splash/>;
 const phase=!user?'guest':!user.age||!user.city?'setup':user.role==='USER'&&!user.interests?.length?'interests':'ready';
 return <NavigationContainer key={phase}><StatusBar barStyle="dark-content" backgroundColor={colors.cream}/><Stack.Navigator screenOptions={{headerShown:false}}>
  {phase==='guest'?<Stack.Screen name="Auth" component={Auth}/>:phase==='setup'?<Stack.Screen name="Setup" component={Setup}/>:phase==='interests'?<Stack.Screen name="Interests" component={Interests}/>:<>
   <Stack.Screen name="Tabs" component={MainTabs}/>
   <Stack.Screen name="EventDetail" component={Detail}/>
   <Stack.Screen name="Publish" component={Publish}/>
   {user?.role==='USER'&&<Stack.Screen name="Interests" component={Interests}/>}</>}
 </Stack.Navigator></NavigationContainer>;
}
export default function App(){return <SafeAreaProvider><Provider><Root/></Provider></SafeAreaProvider>}
const styles=StyleSheet.create({splash:{flex:1,backgroundColor:colors.forest,alignItems:'center',justifyContent:'center'},logo:{width:115,height:115},brand:{fontSize:35,fontWeight:'900',color:'#fff',letterSpacing:-1,marginTop:13},slogan:{fontSize:15,color:'#D7ECDB',marginTop:9}});
