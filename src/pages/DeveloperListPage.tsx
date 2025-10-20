import React, { useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonText,
  IonButton,
  IonIcon,
  useIonRouter,
} from '@ionic/react';
import { add, logOut } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import DeveloperList from '../components/DeveloperList';
import { useDevelopers } from '../hooks/useDevelopers';
import { useAppWebSocket } from '../context/WebSocketContext';
import { useAuth } from '../context/AuthContext'; // presupunem că ai un context de autentificare

const DeveloperListPage: React.FC = () => {
  const {
    developers,
    loading,
    error,
    isConnected,
    loadDevelopers,
    updateDeveloper,
    deleteDeveloper,
  } = useDevelopers();

  const { lastMessage } = useAppWebSocket();
  const { logout } = useAuth(); // funcția de logout
  const router = useIonRouter();

  useEffect(() => {
    loadDevelopers();
  }, [loadDevelopers, lastMessage]);

  const handleOpenAdd = () =>{
    window.location.pathname = '/developers/add'
  }

  const handleLogout = () => {
    logout();
    router.push('/login', 'back', 'replace');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="bg-gradient-to-r from-blue-600 to-blue-700">
          <IonText className="text-white font-semibold">Developers</IonText>
          
          <div style={{ textAlign: 'center', flex: 1 }}>
            <IonText className="text-white font-semibold flex items-center">
              <span
                className={`inline-block w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-300' : 'bg-red-300'}`}
                aria-hidden="true"
              />
              {isConnected ? '✅ Connected' : '❌ Disconnected'}
            </IonText>
          </div>


          <IonButton
            slot="end"
            className="bg-white text-blue-600 rounded-lg hover:scale-105 transition-transform mr-2"
            onClick={handleOpenAdd}
          >
            <IonIcon icon={add} slot="start" />
            Add
          </IonButton>

          {/* Buton Logout */}
          <IonButton
            slot="end"
            className="bg-red-500 text-white rounded-lg hover:scale-105 transition-transform"
            onClick={handleLogout}
          >
            <IonIcon icon={logOut} slot="start" />
            Logout
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding bg-gray-50 min-h-screen">
        {loading && (
          <div className="flex justify-center mt-6">
            <IonSpinner name="dots" className="text-blue-600" />
          </div>
        )}

        {error && (
          <IonText className="text-red-500 text-center block text-sm mt-3">
            {error.message}
          </IonText>
        )}

        {!loading && !error && (
          <DeveloperList
            developers={developers}
            onDelete={deleteDeveloper}
            onUpdate={updateDeveloper}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default DeveloperListPage;
