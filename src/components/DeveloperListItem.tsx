import React, { useEffect, useState } from 'react';
import { Developer } from '../types/developer';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { create, trash, save } from 'ionicons/icons';

interface Props {
  developer: Developer;
  onUpdate: (dev: Developer) => void;
  onDelete: (id: number) => void;
}

const DeveloperListItem: React.FC<Props> = ({ developer, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDev, setEditedDev] = useState(developer);
  const [errors, setErrors] = useState({ name: '', age: '', endDate: '' });

  const validate = () => {
    let isValid = true;
    const newErrors = { name: '', age: '', endDate: '' };

    if (!editedDev.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!editedDev.age || editedDev.age < 18 || editedDev.age > 100) {
      newErrors.age = 'Age must be between 18 and 100';
      isValid = false;
    }
    if (!editedDev.endDate || new Date(editedDev.endDate) <= new Date()) {
      newErrors.endDate = 'End date must be in the future';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    console.log(editedDev);
    if (validate()) {
      onUpdate(editedDev);
      setIsEditing(false);
    }
  };

  return (
    <IonItem className="bg-white rounded-xl shadow-md border border-gray-100 mb-3 animate-slide-in transition-all duration-300 hover:shadow-lg">
      {isEditing ? (
        <IonLabel className="p-6">
          <div className="mb-5">
            <IonInput
            className="border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-400 transition-all"
            value={editedDev.name}
            placeholder="Enter name"
            onInput={(e: any) => setEditedDev({ ...editedDev, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
          </div>
          <div className="mb-5">
            <IonInput
            className="border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-400 transition-all"
            type="number"
            value={editedDev.age}
            placeholder="Enter age"
            onInput={(e: any) => setEditedDev({ ...editedDev, age: Number(e.target.value) || 0 })}
            />
            {errors.age && <p className="text-red-500 text-sm mt-2">{errors.age}</p>}
          </div>
          <div className="mb-5">
            <IonInput
              className="border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-400 transition-all"
              type="date"
              value={editedDev.endDate}
              onIonChange={(e) => setEditedDev({ ...editedDev, endDate: e.detail.value! })}
            />
            {errors.endDate && <p className="text-red-500 text-sm mt-2">{errors.endDate}</p>}
          </div>
          <div className="flex space-x-3">
            <IonButton
              size="small"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:scale-105 transition-transform"
              onClick={handleSave}
            >
              <IonIcon icon={save} slot="start" />
              Save
            </IonButton>
            <IonButton
              size="small"
              className="bg-gray-200 text-gray-800 rounded-lg hover:scale-105 transition-transform"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </IonButton>
          </div>
        </IonLabel>
      ) : (
        <IonLabel className="p-6">
          <h2 className="text-xl font-semibold text-gray-800">{developer.name}</h2>
          <p className="text-gray-600 text-sm">Age: {developer.age}</p>
          <p className="text-gray-600 text-sm">Full Stack: {developer.fullStack ? 'Yes' : 'No'}</p>
          <p className="text-gray-600 text-sm">End Date: {developer.endDate}</p>
          <div className="flex space-x-3 mt-4">
            <IonButton
              size="small"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:scale-105 transition-transform"
              onClick={() => setIsEditing(true)}
            >
              <IonIcon icon={create} slot="start" />
              Edit
            </IonButton>
            <IonButton
              color="danger"
              size="small"
              className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:scale-105 transition-transform"
              onClick={() => onDelete(developer.id)}
            >
              <IonIcon icon={trash} slot="start" />
              Delete
            </IonButton>
          </div>
        </IonLabel>
      )}
    </IonItem>
  );
};

export default DeveloperListItem;