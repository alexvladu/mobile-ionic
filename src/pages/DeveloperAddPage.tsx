import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonToggle,
  IonBackButton,
  IonButtons,
  useIonRouter,
} from '@ionic/react';
import { useDevelopers } from '../hooks/useDevelopers';
import { DeveloperFormData } from '../types/developer';
import { useHistory } from 'react-router-dom';
const DeveloperAddPage: React.FC = () => {
  const { addDeveloper } = useDevelopers();
  const router = useIonRouter();

  const [newDeveloper, setNewDeveloper] = useState<DeveloperFormData>({
    name: '',
    age: 25,
    fullStack: false,
    endDate: '',
  });
  const [errors, setErrors] = useState({ name: '', age: '', endDate: '' });

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

  const handleSave = () => {
    if (validate()) {
      addDeveloper(newDeveloper);
      router.push('/developers');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="bg-gradient-to-r from-blue-600 to-blue-700">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/developers" color="medium" />
          </IonButtons>
          <IonTitle className="text-white font-semibold">Add Developer</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding bg-gray-50">
        <IonItem>
          <IonLabel position="stacked">Name</IonLabel>
          <IonInput
            value={newDeveloper.name}
            onIonChange={(e) => setNewDeveloper({ ...newDeveloper, name: e.detail.value! })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Age</IonLabel>
          <IonInput
            type="number"
            value={newDeveloper.age}
            onIonChange={(e) => setNewDeveloper({ ...newDeveloper, age: Number(e.detail.value) })}
          />
          {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
        </IonItem>

        <IonItem>
          <IonLabel>Full Stack</IonLabel>
          <IonToggle
            checked={newDeveloper.fullStack}
            onIonChange={(e) => setNewDeveloper({ ...newDeveloper, fullStack: e.detail.checked })}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">End Date</IonLabel>
          <IonInput
            type="date"
            value={newDeveloper.endDate}
            onIonChange={(e) => setNewDeveloper({ ...newDeveloper, endDate: e.detail.value! })}
          />
          {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
        </IonItem>

        <IonButton expand="block" className="mt-5" onClick={handleSave}>
          Save Developer
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default DeveloperAddPage;
