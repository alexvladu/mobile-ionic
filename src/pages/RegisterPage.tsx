import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
  IonIcon,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonProgressBar,
} from "@ionic/react";
import { 
  personOutline, 
  lockClosedOutline, 
  personAddOutline,
  arrowForwardOutline,
  eyeOutline,
  eyeOffOutline,
  warningOutline,
  checkmarkOutline 
} from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import './RegisterPage.css';

const RegisterPage: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!username || !password) {
      setMessage("Completează toate câmpurile!");
      return;
    }

    if (password.length < 6) {
      setMessage("Parola trebuie să aibă minim 6 caractere!");
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      // API REAL - DECOMENTEAZĂ CÂND AI BACKEND
      // await api.post("/auth/register", { username, password });
      // setMessage("Cont creat cu succes!");
      // setTimeout(() => history.push("/login"), 1500);

      // PENTRU TEST: Simulează delay fără logică mock
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage("Cont creat cu succes!");
      setTimeout(() => history.push("/login"), 1500);

    } catch (err: any) {
      setMessage(err.response?.data?.message || "Eroare la înregistrare");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegister();
  };

  return (
    <IonPage className="register-page">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Creează cont</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding register-content" scrollY={true}>
        <div className="register-background-overlay"></div>
        
        {loading && <IonProgressBar type="indeterminate" color="light" />}

        <IonCard className="register-card">
          <IonCardContent className="ion-padding">
            <div className="register-logo-container">
              <div className="register-logo-circle">
                <IonIcon icon={personAddOutline} className="register-logo-icon" />
              </div>
              <h1 className="register-welcome-text">Înregistrare</h1>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              <IonItem className="register-custom-input-item" lines="none">
                <IonIcon icon={personOutline} slot="start" className="register-input-icon" />
                <IonLabel position="stacked" className="register-input-label">
                  Username
                </IonLabel>
                <IonInput
                  value={username}
                  onIonChange={(e) => setUsername(e.detail.value || "")}
                  className="register-custom-input"
                  placeholder="Alege un username unic"
                  required
                />
              </IonItem>

              <IonItem className="register-custom-input-item" lines="none">
                <IonIcon icon={lockClosedOutline} slot="start" className="register-input-icon" />
                <IonLabel position="stacked" className="register-input-label">
                  Parola
                </IonLabel>
                <IonInput
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value || "")}
                  className="register-custom-input"
                  placeholder="Minim 6 caractere"
                  required
                />
                <IonIcon 
                  icon={showPassword ? eyeOffOutline : eyeOutline} 
                  slot="end"
                  className="register-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </IonItem>

              {message && (
                <div className={`register-message-container register-${message.includes("succes") ? "success" : "error"}`}>
                  <IonText className={`register-${message.includes("succes") ? "success-text" : "error-text"}`}>
                    <IonIcon 
                      icon={message.includes("succes") ? checkmarkOutline : warningOutline} 
                      className="register-message-icon" 
                    />
                    {message}
                  </IonText>
                </div>
              )}

              <IonButton 
                type="submit"
                expand="block" 
                className="register-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <IonSpinner name="crescent" className="register-spinner" />
                    Creează cont...
                  </>
                ) : (
                  <>
                    Înregistrează-te
                    <IonIcon icon={arrowForwardOutline} slot="end" />
                  </>
                )}
              </IonButton>
            </form>

            <div className="register-footer-links">
              <IonButton
                fill="clear"
                expand="block"
                className="register-login-button"
                onClick={() => history.push("/login")}
                disabled={loading}
              >
                <IonIcon icon={personOutline} slot="start" />
                Ai deja cont? Intră
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;