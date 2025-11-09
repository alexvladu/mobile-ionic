import React, { useEffect, useState } from 'react';
import { Developer } from '../types/developer';
import DeveloperListItem from './DeveloperListItem';
import { IonList, IonButton, IonIcon } from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

interface Props {
  developers: Developer[];
  onUpdate: (dev: Developer) => void;
  onDelete: (id: number) => void;
}

const DeveloperList: React.FC<Props> = ({
  developers,
  onDelete,
  onUpdate
}) => {

  return (
    <div className="flex flex-col gap-4 p-4">
      <IonList className="space-y-4">
        {developers.map((dev) => (
          <DeveloperListItem
            key={dev.id}
            developer={dev}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </IonList>
    </div>
  );
};

export default DeveloperList;
