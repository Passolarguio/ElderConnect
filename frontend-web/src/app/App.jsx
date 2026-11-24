import {BrowserRouter,HashRouter,Navigate,Route,Routes,useLocation} from 'react-router-dom';
import {AppProvider,useApp,nextScreen} from './AppContext.jsx';
import {FullLoader} from '../components/Ui.jsx';
import AuthPage from '../pages/AuthPage.jsx';
import {ProfileSetupPage,InterestsPage} from '../pages/OnboardingPages.jsx';
import {HomePage,ExplorePage} from '../pages/DiscoverPages.jsx';
import {EventPage,MyEventsPage} from '../pages/EventPages.jsx';
import {OrganizerDashboard,CreateEventPage} from '../pages/OrganizerPages.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import AppShell from '../components/AppShell.jsx';
function Guard({children,role}){const {user,booting}=useApp();if(booting)return <FullLoader/>;if(!user)return <Navigate to="/" replace/>;if(role&&user.role!==role)return <Navigate to={nextScreen(user)} replace/>;return children;}
function Entry(){const {user,booting}=useApp();if(booting)return <FullLoader/>;return user?<Navigate to={nextScreen(user)} replace/>:<AuthPage/>;}
function NotFound(){return <Navigate to="/" replace/>;}
function RouteTree(){return <Routes>
 <Route path="/" element={<Entry/>}/><Route path="/entrar" element={<AuthPage defaultMode="login"/>}/>
 <Route path="/criar-perfil" element={<Guard><ProfileSetupPage/></Guard>}/>
 <Route path="/escolher-interesses" element={<Guard role="USER"><InterestsPage/></Guard>}/>
 <Route element={<Guard><AppShell/></Guard>}>
  <Route path="/inicio" element={<Guard role="USER"><HomePage/></Guard>}/>
  <Route path="/explorar" element={<ExplorePage/>}/>
  <Route path="/evento/:id" element={<EventPage/>}/>
  <Route path="/favoritos" element={<Guard role="USER"><MyEventsPage saved/></Guard>}/>
  <Route path="/minhas-inscricoes" element={<Guard role="USER"><MyEventsPage/></Guard>}/>
  <Route path="/perfil" element={<ProfilePage/>}/>
  <Route path="/organizador" element={<Guard role="ORGANIZER"><OrganizerDashboard/></Guard>}/>
  <Route path="/organizador/novo-evento" element={<Guard role="ORGANIZER"><CreateEventPage/></Guard>}/>
 </Route><Route path="*" element={<NotFound/>}/>
 </Routes>}
export default function App(){const Router=window.location.hostname.endsWith('.github.io')?HashRouter:BrowserRouter;return <Router><AppProvider><RouteTree/></AppProvider></Router>}
