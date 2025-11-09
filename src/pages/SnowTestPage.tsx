// src/pages/SnowTestPage.tsx
import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from '@ionic/react';
import { motion } from 'framer-motion';

const SNOWFLAKE_COUNT = 550;

/** Tiny reusable snowflake SVG (pure CSS-friendly) */
const SnowflakeIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-white"
  >
    <path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 15 L7 18 L9 12 L4 8 L10 8 Z" />
  </svg>
);

const SnowTestPage: React.FC = () => {
  const [debug, setDebug] = useState(false);

  return (
    <IonPage className="h-screen overflow-hidden">
      {/* Dark backdrop – white snowflakes pop */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-800 to-gray-900 z-0" />

      {/* ==================== SNOW LAYER ==================== */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
        {Array.from({ length: SNOWFLAKE_COUNT }).map((_, i) => {
          const size = Math.random() * 12 + 8; // 8–20px
          const left = Math.random() * 100; // 0–100%
          const delay = Math.random() * 12;
          const duration = Math.random() * 10 + 12; // 12–22s
          const drift = (Math.random() - 0.5) * 70; // -35 to +35px
          const spin = Math.random() > 0.5 ? 360 : -360; // random direction

          return (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${left}%`,
                top: '-30px',
              }}
              initial={{ y: -40, opacity: 0, rotate: 0 }}
              animate={{
                y: '110vh',
                x: [0, drift, -drift, drift * 0.6, 0],
                opacity: [0, 0.8, 1, 0.8, 0],
                rotate: spin,
              }}
              transition={{
                y: { duration, delay, repeat: Infinity, ease: 'linear' },
                x: { duration: duration * 0.75, delay, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration, delay, repeat: Infinity, ease: 'easeInOut', times: [0, 0.1, 0.5, 0.9, 1] },
                rotate: { duration: duration * 1.2, delay, repeat: Infinity, ease: 'linear' },
              }}
            >
              {debug ? (
                /* Debug: bright pink dot */
                <div
                  className="rounded-full bg-pink-500 shadow-lg"
                  style={{ width: size * 0.6, height: size * 0.6 }}
                />
              ) : (
                /* Real snowflake */
                <div className="drop-shadow-md">
                  <SnowflakeIcon size={size} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ==================== UI LAYER ==================== */}
      <IonHeader>
        <IonToolbar color="light">
          <IonTitle>Snow Test – Real Flakes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="relative z-20">
        <div className="flex flex-col items-center justify-center h-full text-white px-4">
          <h1 className="text-4xl font-bold mb-4">Snow is Falling!</h1>
          <p className="text-center mb-8 max-w-sm">
            Toggle <strong>Debug</strong> to see pink dots (motion test). Normal mode shows real snowflakes.
          </p>

          <IonButton
            onClick={() => setDebug((d) => !d)}
            color={debug ? 'danger' : 'success'}
            size="large"
          >
            {debug ? 'Normal (Snowflakes)' : 'Debug (Pink Dots)'}
          </IonButton>

          <p className="mt-6 text-sm opacity-70">
            {SNOWFLAKE_COUNT} flakes • {debug ? 'Debug' : 'Real'} mode
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SnowTestPage;