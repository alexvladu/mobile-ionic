import React, { useEffect, useState } from "react";
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
  useIonRouter
} from "@ionic/react";
import {
  personOutline,
  lockClosedOutline,
  arrowForwardOutline,
  personAddOutline,
  eyeOffOutline,
  eyeOutline
} from 'ionicons/icons';
import './LoginPage.css'
import { login } from "../services/authSerivce";
import { useAuth } from "../context/AuthContext";

const LoginPage: React.FC = () => {
  const router = useIonRouter();
  const { login: setAuthToken, isLoggedIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Te rugăm să completezi toate câmpurile.");
      return;
    }

    setError("");
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const res = await login(username, password);
      setAuthToken(res.token);
      router.push("/developers", 'forward', 'replace');
    } catch (err) {
      setError("Autentificare eșuată. Verifică datele.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <IonPage className="login-page">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Bine ai venit!</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding login-content" scrollY={true}>
        <div className="background-overlay"></div>

        {loading && <IonProgressBar type="indeterminate" color="light" />}

        <IonCard className="login-card">
          <IonCardContent className="ion-padding">
            <div className="logo-container">
              <div className="logo-circle">
                <IonIcon icon={personOutline} className="logo-icon" />
              </div>
              <h1 className="welcome-text">Autentificare</h1>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <IonItem className="custom-input-item" lines="none">
                <IonIcon icon={personOutline} slot="start" className="input-icon" />
                <IonLabel position="stacked" className="input-label">
                  Username
                </IonLabel>
                <IonInput
                  value={username}
                  onIonChange={(e) => setUsername(e.detail.value || "")}
                  className="custom-input"
                  placeholder="Introdu username-ul tău"
                  required
                />
              </IonItem>

              <IonItem className="custom-input-item" lines="none">
                <IonIcon icon={lockClosedOutline} slot="start" className="input-icon" />
                <IonLabel position="stacked" className="input-label">
                  Parola
                </IonLabel>
                <IonInput
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value || "")}
                  className="custom-input"
                  placeholder="Introdu parola"
                  required
                />
                <IonIcon
                  icon={showPassword ? eyeOffOutline : eyeOutline}
                  slot="end"
                  className="register-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </IonItem>

              {error && (
                <div className="error-container">
                  <IonText color="danger" className="error-text">
                    <IonIcon icon="warning-outline" className="error-icon" />
                    {error}
                  </IonText>
                </div>
              )}

              <IonButton
                type="submit"
                expand="block"
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <IonSpinner name="crescent" className="spinner" />
                    Se autentifică...
                  </>
                ) : (
                  <>
                    Autentificare
                    <IonIcon icon={arrowForwardOutline} slot="end" />
                  </>
                )}
              </IonButton>
            </form>

            <div className="footer-links">
              <IonButton
                fill="clear"
                expand="block"
                className="forgot-button"
                onClick={() => router.push("/register", 'forward', 'push')}
                disabled={loading}
              >
                <IonIcon icon={personAddOutline} slot="start" />
                Nu ai cont? Înregistrează-te
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;