import React, { useEffect, useState } from 'react';
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
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonToggle,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import DeveloperList from '../components/DeveloperList';
import { useDevelopers } from '../hooks/useDevelopers';
import { Developer, DeveloperFormData } from '../types/developer';
import { useAppWebSocket } from '../context/WebSocketContext';

const DeveloperListPage: React.FC = () => {
  const {
    developers,
    loading,
    error,
    loadDevelopers,
    addDeveloper,
    updateDeveloper,
    deleteDeveloper,
  } = useDevelopers();

  const {lastMessage}=useAppWebSocket();
  
  const [showModal, setShowModal] = useState(false);
  const [newDeveloper, setNewDeveloper] = useState<DeveloperFormData>({
    name: '',
    age: 25,
    fullStack: false,
    endDate: '',
  });
  const [errors, setErrors] = useState({ name: '', age: '', endDate: '' });

  useEffect(() => {
    loadDevelopers();
  }, [loadDevelopers, lastMessage]);

  const validate = () => {
    let isValid = true;
    const newErrors = { name: '', age: '', endDate: '' };

    if (!newDeveloper.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!newDeveloper.age || newDeveloper.age < 18 || newDeveloper.age > 100) {
      newErrors.age = 'Age must be between 18 and 100';
      isValid = false;
    }
    if (!newDeveloper.endDate || new Date(newDeveloper.endDate) <= new Date()) {
      newErrors.endDate = 'End date must be in the future';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleOpenModal = () => {
    setNewDeveloper({
      name: '',
      age: 25,
      fullStack: false,
      endDate: '',
    });
    setErrors({ name: '', age: '', endDate: '' });
    setShowModal(true);
  };

  const handleSaveDeveloper = () => {
    if (validate()) {
      addDeveloper(newDeveloper);
      setShowModal(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="bg-gradient-to-r from-blue-600 to-blue-700">
          <IonTitle className="text-white font-semibold">Developers</IonTitle>
          <IonButton
            slot="end"
            className="bg-white text-blue-600 rounded-lg hover:scale-105 transition-transform"
            onClick={handleOpenModal}
          >
            <IonIcon icon={add} slot="start" />
            Add
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding bg-gray-50 min-h-screen">
        {loading && <IonSpinner name="dots" className="mx-auto my-6 text-blue-600" />}
        {error && <IonText className="text-red-500 text-center text-sm">{error.message}</IonText>}

        {!loading && !error && (
          <DeveloperList
            developers={developers}
            onDelete={deleteDeveloper}
            onUpdate={updateDeveloper}
          />
        )}

        <IonModal
          isOpen={showModal}
          onDidDismiss={() => setShowModal(false)}
          className="animate-slide-in"
        >
          <IonHeader>
            <IonToolbar className="bg-gradient-to-r from-blue-600 to-blue-700">
              <IonTitle className="text-white font-semibold">Add Developer</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding bg-gray-50">
            <IonItem className="mb-5 border-0">
              <IonLabel position="stacked" className="text-gray-800 font-medium">Name</IonLabel>
              <IonInput
                className="border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-400 transition-all"
                value={newDeveloper.name}
                placeholder="Enter name"
                onIonChange={(e) => setNewDeveloper({ ...newDeveloper, name: e.detail.value! })}
              />
              {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
            </IonItem>

            <IonItem className="mb-5 border-0">
              <IonLabel position="stacked" className="text-gray-800 font-medium">Age</IonLabel>
              <IonInput
                className="border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-400 transition-all"
                type="number"
                value={newDeveloper.age}
                placeholder="Enter age"
                onIonChange={(e) => setNewDeveloper({ ...newDeveloper, age: Number(e.detail.value) })}
              />
              {errors.age && <p className="text-red-500 text-sm mt-2">{errors.age}</p>}
            </IonItem>

            <IonItem className="mb-5 border-0">
              <IonLabel className="text-gray-800 font-medium">Full Stack</IonLabel>
              <IonToggle
                checked={newDeveloper.fullStack}
                onIonChange={(e) => setNewDeveloper({ ...newDeveloper, fullStack: e.detail.checked })}
                className="text-blue-600"
              />
            </IonItem>

            <IonItem className="mb-5 border-0">
              <IonLabel position="stacked" className="text-gray-800 font-medium">End Date</IonLabel>
              <IonInput
                className="border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-400 transition-all"
                type="date"
                value={newDeveloper.endDate}
                onIonChange={(e) => setNewDeveloper({ ...newDeveloper, endDate: e.detail.value! })}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-2">{errors.endDate}</p>}
            </IonItem>

            <IonButton
              expand="block"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:scale-105 transition-transform mt-6"
              onClick={handleSaveDeveloper}
            >
              Save Developer
            </IonButton>

            <IonButton
              expand="block"
              className="bg-gray-200 text-gray-800 rounded-lg hover:scale-105 transition-transform mt-3"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default DeveloperListPage;