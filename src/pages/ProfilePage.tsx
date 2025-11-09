import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonAvatar,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  IonBackButton,
  IonButtons,
  IonToast,
  IonList,
  IonActionSheet,
  IonAlert,
  IonModal,
} from '@ionic/react';
import {
  person,
  mail,
  call,
  briefcase,
  calendar,
  pencil,
  save,
  close,
  camera,
  trash,
} from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { getAvatarURL, uploadAvatarFile } from '../services/profileService';

const ProfilePage: React.FC = () => {
  const user: any = {};
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showWebcamModal, setShowWebcamModal] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [webcamImage, setWebcamImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '+1 (555) 123-4567',
    position: user?.position || 'Senior Developer',
    joinDate: user?.joinDate || '2023-01-15',
    bio: user?.bio || 'Passionate developer with experience in web and mobile applications.',
  });

  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatar || `https://ui-avatars.com/api/?name=${formData.name}&background=random&size=200`
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    console.log('Saving profile:', formData);
    await uploadAvatarFile(avatarUrl);
    setToastMessage('Profile updated successfully!');
    setShowToast(true);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || 'John Doe',
      email: user?.email || 'john.doe@example.com',
      phone: user?.phone || '+1 (555) 123-4567',
      position: user?.position || 'Senior Developer',
      joinDate: user?.joinDate || '2023-01-15',
      bio: user?.bio || 'Passionate developer with experience in web and mobile applications.',
    });
    setIsEditing(false);
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
        console.error('Camera not accessible:', err);
        setToastMessage('Camera not accessible in browser.');
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
          setAvatarUrl(photo.dataUrl);
          setToastMessage('Photo updated successfully!');
          setShowToast(true);
        }
      } catch (error: any) {
        console.error('Error taking photo:', error);
        if (
          error.message &&
          (error.message.includes('cancelled') || error.message.includes('cancel'))
        )
          return;

        setToastMessage('Failed to capture photo. Please try again.');
        setShowToast(true);
      }
    }
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
    setWebcamImage(imageDataUrl);
    setToastMessage('Photo captured successfully!');
    setShowToast(true);
    closeWebcam();
  };

  const closeWebcam = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
    }
    setVideoStream(null);
    setShowWebcamModal(false);
  };

  const removePhoto = () => {
    setShowAlert(true);
  };

  const confirmRemovePhoto = () => {
    setAvatarUrl(`https://ui-avatars.com/api/?name=${formData.name}&background=random&size=200`);
    setToastMessage('Photo removed successfully!');
    setShowToast(true);
    setShowAlert(false);
  };



  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const avatar = await getAvatarURL();
        console.log(avatar);
        setAvatarUrl(avatar);
      } catch (error) {
        console.error('Failed to load avatar:', error);
        setToastMessage('Failed to load avatar');
        setShowToast(true);
      }
    };

    fetchAvatar(); 
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="bg-gradient-to-r from-blue-600 to-blue-700">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/developers" className="text-white" />
          </IonButtons>
          <IonTitle className="text-white font-semibold">My Profile</IonTitle>
          <IonButtons slot="end">
            {!isEditing ? (
              <IonButton onClick={() => setIsEditing(true)}>
                <IonIcon icon={pencil} className="text-white" />
              </IonButton>
            ) : (
              <>
                <IonButton onClick={handleCancel}>
                  <IonIcon icon={close} className="text-white" />
                </IonButton>
                <IonButton onClick={handleSave}>
                  <IonIcon icon={save} className="text-white" />
                </IonButton>
              </>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding bg-gray-50">
        <div className="flex flex-col items-center py-6">
          <div className="relative" style={{textAlign:'center'}}>
            <IonAvatar style={{ width: '600px', height: '600px', margin: '0 auto' }}>
              <img src={avatarUrl} alt="Profile" />
            </IonAvatar>
            {isEditing && (
              <IonButton
                onClick={handleAvatarChange}
                className="absolute bottom-0 right-0 rounded-full"
                size="small"
                color="primary"
              >
                <IonIcon icon={camera} />
              </IonButton>
            )}
          </div>
        </div>
        

        
      </IonContent>

      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
        header="Change Profile Photo"
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
        message="Are you sure you want to remove your profile photo?"
        buttons={[
          { text: 'Cancel', role: 'cancel' },
          { text: 'Remove', role: 'destructive', handler: confirmRemovePhoto },
        ]}
      />

      {/* Webcam Modal for browser */}
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

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="top"
        color="success"
      />
    </IonPage>
  );
};

export default ProfilePage;
