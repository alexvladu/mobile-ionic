import React, { useEffect, useState, useRef } from 'react';
import { Developer } from '../types/developer';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonAvatar,
  IonActionSheet,
  IonAlert,
  IonModal,
  IonToast,
} from '@ionic/react';
import { create, trash, save, camera } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { uploadDeveloperPhoto } from '../services/developerSevice';
import MapInDiv from './MapInDiv';

interface Props {
  developer: Developer;
  onUpdate: (dev: Developer) => void;
  onDelete: (id: number) => void;
}

const DeveloperListItem: React.FC<Props> = ({ developer, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDev, setEditedDev] = useState(developer);
  const [errors, setErrors] = useState({ name: '', age: '', endDate: '' });
  const [photoPreview, setPhotoPreview] = useState<string | null>(developer.photoURL || null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showWebcamModal, setShowWebcamModal] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [avatarUrl, setAvatarUrl] = useState(
    developer.photoURL || `https://ui-avatars.com/api/?name=${developer.name}&background=random&size=200`
  );


  useEffect(() => {
    setEditedDev(developer);
    setPhotoPreview(developer.photoURL || null);
  }, [developer]);

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
    if (validate()) {
      onUpdate({ ...editedDev, photoURL: photoPreview || undefined });
      setAvatarUrl(photoPreview || avatarUrl);
      uploadDeveloperPhoto(photoPreview || '', developer.id);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedDev(developer);
    setPhotoPreview(developer.photoURL || null);
    setErrors({ name: '', age: '', endDate: '' });
  };

  const handleAvatarChange = () => {
    setShowActionSheet(true);
  };

  const takePicture = async () => {
    const platform = Capacitor.getPlatform();

    if (platform === 'web') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoStream(stream);
        setShowWebcamModal(true);
      } catch (err) {
        console.error('Camera access denied:', err);
        setToastMessage('Camera access denied. Please allow camera permission.');
        setShowToast(true);
      }
    } else {
      try {
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera,
          quality: 90,
        });

        if (photo.dataUrl) {
          setPhotoPreview(photo.dataUrl);
          setEditedDev({ ...editedDev, photoURL: photo.dataUrl });
          setToastMessage('Photo taken!');
          setShowToast(true);
        }
      } catch (error: any) {
        if (error.message?.toLowerCase().includes('cancel')) return;
        setToastMessage('Failed to take photo.');
        setShowToast(true);
      }
    }
    setShowActionSheet(false);
  };

  const captureWebcamPhoto = () => {
    const video = document.getElementById('webcam-video') as HTMLVideoElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setAvatarUrl(imageDataUrl);
    setPhotoPreview(imageDataUrl);
    setEditedDev({ ...editedDev, photoURL: imageDataUrl });
    setToastMessage('Photo captured successfully!');
    setShowToast(true);
    closeWebcam();
  };

  const closeWebcam = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }
    setVideoStream(null);
    setShowWebcamModal(false);
  };

  const removePhoto = () => {
    setShowAlert(true);
    setShowActionSheet(false);
  };

  const confirmRemovePhoto = () => {
    setPhotoPreview(null);
    setEditedDev({ ...editedDev, photoURL: undefined });
    setToastMessage('Photo removed.');
    setShowToast(true);
    setShowAlert(false);
  };

  return (
    <>
      <IonItem className="bg-white rounded-xl shadow-md border border-gray-100 mb-3 animate-slide-in transition-all duration-300 hover:shadow-lg">
        <div className="flex w-full p-6 gap-6">
          <div className="flex-shrink-0">
            {isEditing ? (
              <div className="relative">
                <IonAvatar style={{ width: '75px', height: '75px', margin: '0 auto' }}>
                  <img src={avatarUrl} alt="Profile" onClick={handleAvatarChange}/>
                </IonAvatar>
              </div>
            ) : (
              <IonAvatar style={{ width: '75px', height: '75px', margin: '0 auto' }}>
                <img src={avatarUrl} alt="Profile" />
              </IonAvatar>
            )}
          </div>

          <div className="flex-grow">
            {isEditing ? (
              <IonLabel>
                <div className="mb-4">
                  <IonInput
                    className="border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-400 transition-all"
                    value={editedDev.name}
                    placeholder="Enter name"
                    onIonInput={(e) => setEditedDev({ ...editedDev, name: e.detail.value! })}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="mb-4">
                  <IonInput
                    className="border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-400 transition-all"
                    type="number"
                    value={editedDev.age}
                    placeholder="Enter age"
                    onIonInput={(e) => setEditedDev({ ...editedDev, age: Number(e.detail.value) || 0 })}
                  />
                  {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                </div>

                <div className="mb-4">
                  <IonInput
                    className="border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-400 transition-all"
                    type="date"
                    value={editedDev.endDate}
                    onIonChange={(e) => setEditedDev({ ...editedDev, endDate: e.detail.value! })}
                  />
                  {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                </div>
                <div className="flex space-x-3 mt-4">
                  <IonButton
                    size="small"
                    fill="outline"
                    color="primary"
                    onClick={() => setShowLocationModal(true)}
                  >
                    Edit Location
                  </IonButton>
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
                    fill="outline"
                    className="rounded-lg hover:scale-105 transition-transform"
                    onClick={handleCancel}
                  >
                    Cancel
                  </IonButton>
                </div>
              </IonLabel>
            ) : (
              <IonLabel>
                <h2 className="text-xl font-semibold text-gray-800">{developer.name}</h2>
                <p className="text-gray-600 text-sm">Age: {developer.age}</p>
                <p className="text-gray-600 text-sm">Full Stack: {developer.fullStack ? 'Yes' : 'No'}</p>
                <p className="text-gray-600 text-sm">End Date: {new Date(developer.endDate).toLocaleDateString()}</p>
                <p className="text-gray-600 text-sm">Location: {developer.lat ? developer.lat : 'Unknow'} {developer.lng}</p>

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
          </div>
        </div>
      </IonItem>

      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
        buttons={[
          {
            text: 'Take Photo',
            icon: camera,
            handler: takePicture,
          },
          {
            text: 'Remove Photo',
            icon: trash,
            role: 'destructive',
            handler: removePhoto,
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ]}
      />

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Remove Photo"
        message="Are you sure you want to remove the profile photo?"
        buttons={[
          { text: 'Cancel', role: 'cancel' },
          { text: 'Remove', role: 'destructive', handler: confirmRemovePhoto },
        ]}
      />

      <IonModal isOpen={showWebcamModal} onDidDismiss={closeWebcam}>
        <div className="flex flex-col items-center justify-center h-full bg-black">
          <video
            id="webcam-video"
            autoPlay
            playsInline
            style={{ width: '100%', height: 'auto', maxHeight: '80vh' }}
            ref={(video) => {
              if (video && videoStream) {
                video.srcObject = videoStream;
              }
            }}
          ></video>
          <div className="flex gap-4 mt-4">
            <IonButton color="success" onClick={captureWebcamPhoto}>
              Capture
            </IonButton>
            <IonButton color="medium" onClick={closeWebcam}>
              Cancel
            </IonButton>
          </div>
        </div>
      </IonModal>

      <IonModal isOpen={showLocationModal} onDidDismiss={() => setShowLocationModal(false)}>
  <div className="flex flex-col h-full bg-white">
    <div className="p-6 border-b">
      <h2 className="text-xl font-semibold">Edit Location</h2>
    </div>

    <MapInDiv
        lat={editedDev.lat || 44.4268}
        lng={editedDev.lng || 26.1025}
        height="250px"
        onLocationSelect={(lat, lng) => {
          console.log('Selected location:', lat, lng);
          setEditedDev({ ...editedDev, lat, lng });
        }}
    />

    <div className="p-6 border-t flex justify-end space-x-3">
      <IonButton fill="outline" onClick={() => setShowLocationModal(false)}>
        Cancel
      </IonButton>
      <IonButton
        color="primary"
        onClick={() => {
          setShowLocationModal(false);
          setToastMessage('Location updated!');
          setShowToast(true);
        }}
      >
        Save
      </IonButton>
    </div>
  </div>
</IonModal>

      {/* Toast */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="top"
        color={toastMessage.includes('fail') || toastMessage.includes('denied') ? 'danger' : 'success'}
      />
    </>
  );
};

export default DeveloperListItem;