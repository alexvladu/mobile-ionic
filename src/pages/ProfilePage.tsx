import React, { useState } from 'react';
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
  image,
  trash,
} from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const ProfilePage: React.FC = () => {
  const user: any = {};
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Form state
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

  const handleSave = () => {
    // Here you would typically make an API call to save the profile
    console.log('Saving profile:', formData);

    setToastMessage('Profile updated successfully!');
    setShowToast(true);
    setIsEditing(false);

    // Update avatar if name changed
    if (formData.name !== user?.name) {
      setAvatarUrl(`https://ui-avatars.com/api/?name=${formData.name}&background=random&size=200`);
    }
  };

  const handleCancel = () => {
    // Reset form data
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

  const takePicture = async (source: CameraSource) => {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        quality: 90,
        allowEditing: true,
        width: 500,
        height: 500,
        correctOrientation: true,
        saveToGallery: false,
        promptLabelHeader: 'Select Photo Source',
        promptLabelCancel: 'Cancel',
        promptLabelPhoto: 'From Gallery',
        promptLabelPicture: 'Take Photo',
      });

      if (photo.dataUrl) {
        setAvatarUrl(photo.dataUrl);
        setToastMessage('Photo updated successfully!');
        setShowToast(true);
      }
    } catch (error: any) {
      console.error('Error taking photo:', error);
      
      // Handle user cancellation gracefully
      if (error.message && (
        error.message.includes('cancelled') || 
        error.message.includes('cancel') ||
        error.message.includes('User cancelled')
      )) {
        // User cancelled, don't show error message
        return;
      }
      
      // Show error for actual failures
      setToastMessage('Failed to capture photo. Please try again.');
      setShowToast(true);
    }
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
        {/* Avatar Section */}
        <div className="flex flex-col items-center py-6">
          <div className="relative">
            <IonAvatar style={{ width: '120px', height: '120px' }}>
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
          <IonText className="mt-4">
            <h2 className="text-2xl font-bold text-gray-800">{formData.name}</h2>
          </IonText>
          <IonText>
            <p className="text-gray-600">{formData.position}</p>
          </IonText>
        </div>

        {/* Profile Information Card */}
        <IonCard className="shadow-md">
          <IonCardHeader>
            <IonCardTitle className="text-lg font-semibold text-blue-600">
              Personal Information
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonIcon icon={person} slot="start" className="text-blue-600" />
                <IonLabel position="stacked">Full Name</IonLabel>
                {isEditing ? (
                  <IonInput
                    value={formData.name}
                    onIonInput={(e) => handleInputChange('name', e.detail.value!)}
                    placeholder="Enter your name"
                  />
                ) : (
                  <IonText className="mt-2">{formData.name}</IonText>
                )}
              </IonItem>

              <IonItem>
                <IonIcon icon={mail} slot="start" className="text-blue-600" />
                <IonLabel position="stacked">Email</IonLabel>
                {isEditing ? (
                  <IonInput
                    type="email"
                    value={formData.email}
                    onIonInput={(e) => handleInputChange('email', e.detail.value!)}
                    placeholder="Enter your email"
                  />
                ) : (
                  <IonText className="mt-2">{formData.email}</IonText>
                )}
              </IonItem>

              <IonItem>
                <IonIcon icon={call} slot="start" className="text-blue-600" />
                <IonLabel position="stacked">Phone</IonLabel>
                {isEditing ? (
                  <IonInput
                    type="tel"
                    value={formData.phone}
                    onIonInput={(e) => handleInputChange('phone', e.detail.value!)}
                    placeholder="Enter your phone"
                  />
                ) : (
                  <IonText className="mt-2">{formData.phone}</IonText>
                )}
              </IonItem>

              <IonItem>
                <IonIcon icon={briefcase} slot="start" className="text-blue-600" />
                <IonLabel position="stacked">Position</IonLabel>
                {isEditing ? (
                  <IonInput
                    value={formData.position}
                    onIonInput={(e) => handleInputChange('position', e.detail.value!)}
                    placeholder="Enter your position"
                  />
                ) : (
                  <IonText className="mt-2">{formData.position}</IonText>
                )}
              </IonItem>

              <IonItem>
                <IonIcon icon={calendar} slot="start" className="text-blue-600" />
                <IonLabel position="stacked">Join Date</IonLabel>
                {isEditing ? (
                  <IonInput
                    type="date"
                    value={formData.joinDate}
                    onIonInput={(e) => handleInputChange('joinDate', e.detail.value!)}
                  />
                ) : (
                  <IonText className="mt-2">
                    {new Date(formData.joinDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </IonText>
                )}
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Bio Section */}
        <IonCard className="shadow-md mt-4">
          <IonCardHeader>
            <IonCardTitle className="text-lg font-semibold text-blue-600">
              About Me
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {isEditing ? (
              <IonItem>
                <IonLabel position="stacked">Bio</IonLabel>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md mt-2"
                />
              </IonItem>
            ) : (
              <IonText>
                <p className="text-gray-700">{formData.bio}</p>
              </IonText>
            )}
          </IonCardContent>
        </IonCard>

        {/* Statistics Card */}
        <IonCard className="shadow-md mt-4 mb-6">
          <IonCardHeader>
            <IonCardTitle className="text-lg font-semibold text-blue-600">
              Statistics
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <IonText>
                  <h3 className="text-2xl font-bold text-blue-600">24</h3>
                  <p className="text-sm text-gray-600">Projects</p>
                </IonText>
              </div>
              <div>
                <IonText>
                  <h3 className="text-2xl font-bold text-green-600">156</h3>
                  <p className="text-sm text-gray-600">Commits</p>
                </IonText>
              </div>
              <div>
                <IonText>
                  <h3 className="text-2xl font-bold text-purple-600">89</h3>
                  <p className="text-sm text-gray-600">Reviews</p>
                </IonText>
              </div>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>

      {/* Action Sheet for Photo Options */}
      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
        header="Change Profile Photo"
        buttons={[
          {
            text: 'Take Photo or Choose from Gallery',
            icon: camera,
            handler: () => {
              takePicture(CameraSource.Prompt);
            },
          },
          {
            text: 'Remove Photo',
            icon: trash,
            role: 'destructive',
            handler: () => {
              removePhoto();
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ]}
      />

      {/* Alert for Remove Photo Confirmation */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Remove Photo"
        message="Are you sure you want to remove your profile photo?"
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Remove',
            role: 'destructive',
            handler: confirmRemovePhoto,
          },
        ]}
      />

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