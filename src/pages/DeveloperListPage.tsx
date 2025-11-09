import React, { useEffect, useState, useRef } from 'react';
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
  IonAvatar,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
  useIonRouter,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/react';
import { add, logOut, person } from 'ionicons/icons';
import { motion, AnimatePresence } from 'framer-motion';

import DeveloperList from '../components/DeveloperList';
import { useDevelopers } from '../hooks/useDevelopers';
import { useAppWebSocket } from '../context/WebSocketContext';
import { useAuth } from '../context/AuthContext';

const SNOWFLAKE_COUNT = 55; // Increased for richer effect

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
    setFilterFullStack,
    searchName,
    setSearchName,
  } = useDevelopers();

  const { lastMessage } = useAppWebSocket();
  const { logout } = useAuth();
  const router = useIonRouter();

  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<Event | undefined>(undefined);

  /* ------------------------------------------------------------------ */
  /*  Reset page when filters change  */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, filterFullStack, setCurrentPage]);

  /* ------------------------------------------------------------------ */
  /*  Load data on page / WS message  */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    loadDevelopers();
  }, [currentPage, loadDevelopers, lastMessage]);

  const hasMore = total != null && developers.length < total;

  /* ------------------------------------------------------------------ */
  /*  Handlers  */
  /* ------------------------------------------------------------------ */
  const handleOpenAdd = () => {
    window.location.href='/developers/add'
  };

  const handleLogout = () => {
    logout();
    router.push('/login', 'back', 'replace');
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    setPopoverEvent(e.nativeEvent);
    setShowPopover(true);
  };

  const handleProfileNavigation = () => {
    setShowPopover(false);
    router.push('/profile', 'forward');
  };

  const handleLoadMore = async (event: CustomEvent) => {
    setCurrentPage((prev) => prev + 1);
    const target = event.target as HTMLIonInfiniteScrollElement;
    target.complete();
    if (!hasMore) target.disabled = true;
  };

  /* ------------------------------------------------------------------ */
  /*  Animation variants  */
  /* ------------------------------------------------------------------ */
  const cardContainerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07 },
    },
  };
  return (
    <IonPage>
      {/* ==================== HEADER ==================== */}
      <IonHeader>
        <IonToolbar className="bg-gradient-to-r from-blue-600 to-blue-700 z-10">
          <motion.div
            className="flex items-center justify-between px-4"
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.5 } }}
          >
            <IonText className="text-white font-semibold text-lg">
              Developers
            </IonText>

            <IonText className="text-white font-semibold flex items-center">
              <span
                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  isConnected ? 'bg-green-300' : 'bg-red-300'
                }`}
                aria-hidden="true"
              />
              {isConnected ? 'Connected' : 'Disconnected'}
            </IonText>

            <div className="flex items-center gap-2">
              <div onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                <IonAvatar className="w-9 h-9">Alex</IonAvatar>
              </div>

              <IonButton
                fill="solid"
                color="light"
                className="rounded-lg"
                onClick={handleOpenAdd}
              >
                <IonIcon icon={add} slot="start" />
                Add
              </IonButton>
            </div>
          </motion.div>
        </IonToolbar>
      </IonHeader>

      {/* ==================== PROFILE POPOVER ==================== */}
      <IonPopover
        isOpen={showPopover}
        event={popoverEvent}
        onDidDismiss={() => setShowPopover(false)}
        side="bottom"
        alignment="end"
      >
        <IonList>
          <IonItem button onClick={handleProfileNavigation}>
            <IonIcon icon={person} slot="start" />
            <IonLabel>My Profile</IonLabel>
          </IonItem>
          <IonItem button onClick={handleLogout} lines="none">
            <IonIcon icon={logOut} slot="start" color="danger" />
            <IonLabel color="danger">Logout</IonLabel>
          </IonItem>
        </IonList>
      </IonPopover>

<IonContent className="ion-padding bg-gray-50 relative z-10 overflow-hidden">
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{position:'absolute'}}>
    {Array.from({ length: 100 }).map((_, i) => {
      const size = Math.random() * 14 + 10; // 10–24px
      const left = Math.random() * 100;
      const delay = Math.random() * 12;
      const duration = Math.random() * 12 + 14;
      const drift = (Math.random() - 0.5) * 70;
      const spin = Math.random() > 0.5 ? 360 : -360;

      return (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${left}%`, top: '-40px' }}
          initial={{ y: -50, opacity: 0, rotate: 0 }}
          animate={{
            y: '110vh',
            x: [0, drift, -drift, drift * 0.7, 0],
            opacity: [0, 0.7, 1, 0.7, 0],
            rotate: spin,
          }}
          transition={{
            y: { duration, delay, repeat: Infinity, ease: 'linear' },
            x: { duration: duration * 0.7, delay, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration, delay, repeat: Infinity, ease: 'easeInOut', times: [0, 0.1, 0.5, 0.9, 1] },
            rotate: { duration: duration * 1.3, delay, repeat: Infinity, ease: 'linear' },
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-white drop-shadow-md"
          >
            <path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 15 L7 18 L9 12 L4 8 L10 8 Z" />
          </svg>
        </motion.div>
      );
    })}
  </div>

  {/* ---- YOUR ORIGINAL CONTENT (on top of snow) ---- */}
  <motion.div
    className="flex flex-col md:flex-row gap-3 mb-5 relative z-10"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
  >
    <IonSearchbar
      placeholder="Search by name..."
      value={searchName || ''}
      debounce={400}
      onIonInput={(e) => setSearchName(e.detail.value ?? '')}
      className="flex-1"
    />

    <IonSelect
      value={filterFullStack}
      onIonChange={(e) => setFilterFullStack(e.detail.value)}
      placeholder="Full Stack"
      interface="popover"
      className="w-full md:w-48"
    >
      <IonSelectOption value="all">All</IonSelectOption>
      <IonSelectOption value="true">Full Stack Only</IonSelectOption>
      <IonSelectOption value="false">Non Full Stack</IonSelectOption>
    </IonSelect>
  </motion.div>

  {loading && currentPage === 1 && (
    <div className="flex justify-center py-10">
      <IonSpinner name="dots" color="primary" />
    </div>
  )}

  {error && (
    <div className="text-center py-6">
      <IonText color="danger">{error.message}</IonText>
    </div>
  )}

  <AnimatePresence mode="wait">
    {developers.length > 0 && (
      <motion.div
        key="dev-list"
        variants={cardContainerVars}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="relative z-10"
      >
        <DeveloperList
          developers={developers}
          onUpdate={updateDeveloper}
          onDelete={deleteDeveloper}
        />
      </motion.div>
    )}
  </AnimatePresence>

  {hasMore && (
    <IonInfiniteScroll
      threshold="300px"
      disabled={loading}
      onIonInfinite={handleLoadMore}
    >
      <IonInfiniteScrollContent>
        <motion.div
          className="flex justify-center py-6"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        >
          <IonSpinner name="dots" color="medium" />
        </motion.div>
      </IonInfiniteScrollContent>
    </IonInfiniteScroll>
  )}

  {!loading && !error && developers.length === 0 && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 text-gray-500 relative z-10"
    >
      <IonText>No developers found.</IonText>
      <div className="mt-3">
        <IonButton fill="clear" size="small" onClick={handleOpenAdd}>
          Add the first one
        </IonButton>
      </div>
    </motion.div>
  )}
</IonContent>
    </IonPage>
  );
};

export default DeveloperListPage;