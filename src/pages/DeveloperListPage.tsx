import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonSpinner,
  IonText,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  useIonRouter,
} from '@ionic/react';
import { add, logOut } from 'ionicons/icons';
import DeveloperList from '../components/DeveloperList';
import { useDevelopers } from '../hooks/useDevelopers';
import { useAppWebSocket } from '../context/WebSocketContext';
import { useAuth } from '../context/AuthContext';

const DeveloperListPage: React.FC = () => {
  const {
    developers,
    loading,
    error,
    isConnected,
    loadDevelopers,
    updateDeveloper,
    deleteDeveloper,
    currentPage,
    setCurrentPage,
    total,
    pageSize,
    filterFullStack,
    setFilterFullStack
  } = useDevelopers();

  const { lastMessage } = useAppWebSocket();
  const { logout } = useAuth();
  const router = useIonRouter();

  // 🔍 Search & Filter (UI only)
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDevelopers();
  }, [loadDevelopers, lastMessage]);

  const handleOpenAdd = () => {
    window.location.pathname = '/developers/add';
  };

  const callbackOnPageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleLogout = () => {
    logout();
    router.push('/login', 'back', 'replace');
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // 🔜 TODO: loadDevelopers({ search: value, fullstack: filterFullstack })
  };

  const handleFilterChange = (value: string) => {
    setFilterFullStack(value);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-between">
          <IonText className="text-white font-semibold text-lg">Developers</IonText>

          <div className="flex items-center space-x-4" style={{textAlign: "center"}}>
            <IonText className="text-white font-semibold flex items-center">
              <span
                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  isConnected ? 'bg-green-300' : 'bg-red-300'
                }`}
                aria-hidden="true"
              />
              {isConnected ? '✅ Connected' : '❌ Disconnected'}
            </IonText>
          </div>

          <div className="actions" style={{textAlign:"right"}}>
            <IonButton
              className="bg-white text-blue-600 rounded-lg hover:scale-105 transition-transform"
              onClick={handleOpenAdd}
            >
              <IonIcon icon={add} slot="start" />
              Add
            </IonButton>

            <IonButton
              className="bg-red-500 text-white rounded-lg hover:scale-105 transition-transform"
              onClick={handleLogout}
            >
              <IonIcon icon={logOut} slot="start" />
              Logout
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding bg-gray-50 min-h-screen">
        {/* 🔍 Search + Filter UI */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <IonSearchbar
            placeholder="Search by name..."
            value={searchTerm}
            debounce={400}
            onIonInput={(e) => handleSearchChange(e.detail.value!)}
          />

          <IonSelect
            value={filterFullStack}
            onIonChange={(e) => handleFilterChange(e.detail.value)}
            placeholder="Filter by Full Stack"
            interface="popover"
          >
            <IonSelectOption value="all">All Developers</IonSelectOption>
            <IonSelectOption value="true">Only Full Stack</IonSelectOption>
            <IonSelectOption value="false">Non Full Stack</IonSelectOption>
          </IonSelect>
        </div>

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
            onPageChange={callbackOnPageChange}
            currentPage={currentPage}
            total={total}
            pageSize={pageSize}
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